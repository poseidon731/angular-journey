import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment.prod';
import { APIResponse, Game } from '../models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getGameList(
    ordering: string,
    search?: string
  ): Observable<APIResponse<Game>> {
    let params = new HttpParams().set('ordering', ordering);

    if (search) {
      params = new HttpParams().set('ordering', ordering).set('search', search);
    }

    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games`, {
      params: params,
    });
  }

  getGameDetails(id: string): Observable<Game> {
    const url: string = `${env.BASE_URL}/games/${id}`;
    const gameInfoRequest = this.http.get(url);
    const gameTrailersReqest = this.http.get(`${url}/movies`);
    const gameSCreenShotsRequest = this.http.get(`${url}/screenshots`);

    return forkJoin({
      gameInfoRequest,
      gameTrailersReqest,
      gameSCreenShotsRequest,
    }).pipe(
      map((resp: any) => {
        return {
          ...resp['gameInfoRequest'],
          screenshots: resp['gameSCreenShotsRequest']?.results,
          trailers: resp['gameTrailersReqest']?.results,
        };
      })
    );
  }
}
