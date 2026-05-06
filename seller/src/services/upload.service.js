import { apiRequest, resolveApiAssetUrl } from './apiClient'

export async function uploadImages(files) {
  const formData = new FormData()
  Array.from(files || []).forEach((file) => formData.append('images', file))
  const paths = await apiRequest('/uploads/images', {
    method: 'POST',
    body: formData
  })
  return (paths || []).map(resolveApiAssetUrl)
}
