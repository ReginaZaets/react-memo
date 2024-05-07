export async function GetLeader() {
  const response = await fetch("https://wedev-api.sky.pro/api/leaderboard", {
    method: "GET",
  });
  const data = await response.json();
  return data;
}

export async function AddLeader({ name, time }) {
  const response = await fetch("https://wedev-api.sky.pro/api/leaderboard", {
    method: "POST",
    body: JSON.stringify({
      name,
      time,
    }),
  });
  const data = response.json();
  return data;
}
