export default function apiResponse(data = null, message = 'Success') {
  return {
    success: true,
    message,
    data
  }
}
