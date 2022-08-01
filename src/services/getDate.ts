export const getDate = (date: string) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleString()
}
