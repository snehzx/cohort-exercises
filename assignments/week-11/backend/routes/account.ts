import { Router } from "express";
import { verifyJwt } from "../middleware";
import { Account } from "../db";
import mongoose from "mongoose";
import { transferSchema } from ".";
const router = Router();
import { z } from "zod";

router.route("/balance").get(verifyJwt, async (req, res) => {
  const account = await Account.findOne({ userId: req.userId });

  if (!account) {
    return res.status(404).json({
      message: "account not found",
    });
  }

  return res.status(200).json({
    message: "account balance fetched successfully",
    account,
  });
});
router.route("/transfer").post(verifyJwt, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //validate input
    const parsedData = transferSchema.safeParse(req.body);

    if (!parsedData.success) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "invalid creds",
        error: z.flattenError(parsedData.error).fieldErrors,
      });
    }
    const { to, amount } = parsedData.data;

    if (to === req.userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "cannot transfer to yourself",
      });
    }

    const recipientAcc = await Account.findOne({ userId: to }).session(session);
    if (!recipientAcc) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "recipient account not found",
      });
    }

    const debitResult = await Account.updateOne(
      {
        userId: req.userId,
        balance: {
          $gte: amount,
        },
      },
      {
        $inc: {
          balance: -amount,
        },
      },
      { session },
    );
    if (debitResult.matchedCount === 0) {
      const senderExists = await Account.exists({
        userId: req.userId,
      }).session(session);
      await session.abortTransaction();
      session.endSession();
      return res.status(senderExists ? 400 : 404).json({
        message: senderExists
          ? "insufficient balance"
          : "sender account not found",
      });
    }

    const creditResult = await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } },
      { session },
    );
    if (creditResult.matchedCount === 0) {
      // Recipient vanished between step 3 and step 5 (rare, but possible).
      // Throwing rolls back the debit above too.
      throw new Error("recipient account unavailable during credit step");
    }
    await session.commitTransaction();
    session.endSession();

    const updatedSender = await Account.findOne({ userId: req.userId });

    return res.status(200).json({
      message: "transfer successful",
      newBalance: updatedSender?.balance,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
});

export default router;
