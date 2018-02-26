import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpModule } from '@angular/http';
import { HttpClientJsonpModule } from '@angular/common/http/src/module';
import { JSONPBackend } from '@angular/http/src/backends/jsonp_backend';
import { ToastController } from 'ionic-angular'

/*
* Tree factory creates a list of "saplings". Saplings are a buffer between Tree Objects
* and JSON data. This list is then sent to the component for instantiation
*/


@Injectable()
export class UserFactory
{
   private  users : Array<user> = [];
    
    //constructor calls the getJson method
    constructor( public http: Http, public toastCtrl  : ToastController)
    { 
    
       this.getJSON();
        
    }

    /**
    * Retrieve the JSON encoded data from the remote server(botaniClash server)
    * Using Angular's Http class - then
    *     *
    * @public
    * @method getJSON()
    * @return {None}
    */

   getJSON() : void
    {
       this.http.get('http://localhost/users.php')
            .map(res => res.json())
            .subscribe(data => 
                {
                    this.users = JSON.parse(JSON.stringify(data));
                    console.log(data);
                });
               
     }
    //Returns the users list to the leaderboardComponent
    getUsers() : user[]
    {
        return this.users;
    }

    /**
    * Update an existing record that has been edited 
    * Use angular's http post method to submit the record data
    * to our remote PHP script
    *
    * @public
    * @method updateEntry
    * @param user_id 			{int} 			
    * @param points 	{int} 			
    * @return {None}
    */
   updateEntry(user_id: number, points : number) : void
   {
      let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= {"id_user" : user_id, "points" : points},
          url       : any      	= "http://localhost.update_users.php";

      this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe(data =>
      {
         // If the request was successful notify the user
         this.sendNotification(`Congratulations the technology: ${name} was successfully updated`);
      },
      (error : any) =>
      {
         this.sendNotification('Something went wrong!');
      });
   }
    /**
    * Manage notifying the user of the outcome of remote operations
    *
    * @public
    * @method sendNotification
    * @param message 	{String} 			Message to be displayed in the notification
    * @return {None}
    */
    sendNotification(message : string)  : void
    {
       let notification = this.toastCtrl.create({
           message       : message,
           duration      : 3000
       });
       notification.present();
    }


}
//interface serves as a buffer between raw JSON and user objects
interface user
{
    username : String,
    totalPoints : number,
    trees : number
}