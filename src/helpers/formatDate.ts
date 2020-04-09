export function formatDateToString(date: Date) {
  const formattedArr = new Date(date).toDateString().split(" ")
  formattedArr.shift()
  return formattedArr.join(" ")
}
