// import { Toast } from 'vant';
import { ResponseData, RequestOptions } from './requestInterface';
import { codeError } from './errorHandler';

export default async function (source: ResponseData, requestOptions: RequestOptions) {
  const {
    errorHandler, successTipMsg, successHandler, disableCommonSuccessHandler,
  } = requestOptions;
  if (source.code !== 200) { // 后端代码错误不通过
    if (errorHandler) {
      return errorHandler(source, requestOptions);
    }
    return codeError(source, requestOptions);
  }

  if (requestOptions.method !== 'GET' && !disableCommonSuccessHandler) {
    // Toast.success(successTipMsg || '操作成功');
  }

  if (successHandler) {
    return successHandler(source, requestOptions);
  }
  return source;
}
