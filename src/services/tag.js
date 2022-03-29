import request from '../utils/request';

export function getTags() {
  return request.get('/tags');
}
