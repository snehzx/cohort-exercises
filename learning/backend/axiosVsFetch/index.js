const axios = require("axios");

// async function main() {
//   const res = await fetch("https://www.postb.in/1780734651807-9706882359459", {
//     method: "POST",
//     body: JSON.stringify({
//       username: "huihui",
//       password: "12345",
//     }),
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer 123",
//     },
//   });
//   const data = await res.text();
//   console.log(data);
// }

async function main() {
  const res = await axios.post(
    "https://httpdump.app/dumps/cba3161d-b4ae-4a6e-9810-da029a195819?a=b",
    {
      username: "huihui",
      password: "12345",
    },
    {
      headers: {
        Authorization: "Bearer 123",
      },
    },
  );
  console.log(res.data);
}
main();
