import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class HelperService {
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  genPaymentId() {
    const hash = crypto.createHash('md5');
    const worker_id = this.configService.get('app.worker_id');

    return hash
      .update(`${new Date().getTime()}_${worker_id}_${Math.random()}`)
      .digest('hex');
  }

  genSignSticpay(text: any) {
    return crypto.createHash('md5').update(text).digest('hex');
  }

  async requestApi(method: string, urlApi: string, params: any) {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    switch (method) {
      case 'POST':
        const responseData = await lastValueFrom(
          this.httpService
            .post(urlApi, params, requestConfig)
            .pipe(
              map((response) => {
                return response.data;
              }),
            )
            .pipe(
              catchError((e) => {
                console.log(e.response.data);
                throw new HttpException(e.response.data, e.response.status);
              }),
            ),
        );
        return responseData;
    }
  }

  async requestSticpayApi(params: any) {
    const method = 'POST';
    const urlApi = this.configService.get('sticpay.sticpay_url');
    return this.requestApi(method, urlApi, params);
  }
}
