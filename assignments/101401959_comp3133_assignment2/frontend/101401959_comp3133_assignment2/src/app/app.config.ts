import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { provideHttpClient, HttpClient, HttpHeaders } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpClient = inject(HttpClient);
      const httpLink = new HttpLink(httpClient);

      const authLink = new ApolloLink((operation, forward) => {
        const token = localStorage.getItem('token');
        operation.setContext({
          headers: new HttpHeaders({
            Authorization: token ? `Bearer ${token}` : '',
          })
        });
        return forward(operation);
      });

      return {
        link: authLink.concat(httpLink.create({ uri: 'http://localhost:4000/graphql' })),
        cache: new InMemoryCache(),
      };
    }),
  ],
};
