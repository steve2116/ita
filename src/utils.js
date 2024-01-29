export function secondsAsReadable(time, round = "s") {
  if (typeof time != "number") return "NaN";
  let seconds = time;
  const days = Math.floor(seconds / 86400);
  seconds -= days * 86400;
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  switch (round) {
    case "1":
    case "d":
      if (time >= 86400) hours = 0;
    case "h":
      if (time >= 3600) minutes = 0;
    case "m":
      if (time >= 60) seconds = 0;
      break;
    case "2":
      if (time >= 86400) minutes = 0;
      if (time >= 3600) seconds = 0;
      break;
    case "3":
      if (time >= 86400) seconds = 0;
      break;
  }
  let result = "";
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  if (seconds > 0) result += `${seconds}s `;
  return result.trimEnd();
}
