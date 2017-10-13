import { Injectable } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Events } from 'ionic-angular';

@Injectable()
export class FacebookProvider {
  userData: any

  constructor(private fb: Facebook, public events: Events) { }

  logIn(){
    let self = this;
    self.fb.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) => {
      self.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
        console.log(profile);
        self.userData = {email: profile['email'], name: profile['name'],
                         picture: profile['picture_large']['data']['url'],
                         userId: profile['id']}
        self.events.publish('Facebook:LoggedIn', self.userData);
      });
      console.log('Logged into Facebook!', res)
    })
    .catch(e => console.log('Error logging into Facebook', e));
  }

  isConnected(){
    let self = this;
    self.fb.getLoginStatus().then((response)=>{
      return response.status == 'connected';
    })
    .catch(e => console.log('Error getting status', e));
  }


}