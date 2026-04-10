import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class ApolloService {

  constructor(private apollo: Apollo) {}

  getEmployees() {
    return this.apollo.watchQuery<any>({
      query: gql`
        query {
          getAllEmployees {
            success
            message
            employees {
              _id
              first_name
              last_name
              position
            }
          }
        }
      `,
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        }
      }
    }).valueChanges;
  }
}