"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function Signup() {
    return <></>;
}

function LabelledInput({ label, placeholder, type = "text", name, onChange }: LabelledInputType) {
    return <></>;
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    name: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}