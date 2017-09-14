import { NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Platform } from 'ionic-angular';

export class ShowBasePage {

  item: any

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public socialSharing: SocialSharing, public platform: Platform) {
    this.item = navParams.get('item');
  }

  toggleGroup(event, _class, col, h_id) {
    if(document.getElementById(col)){
      if (event.classList.contains(_class)) {
        document.getElementById(col).style.display = 'none';
        document.getElementById(_class).style.display = 'block';
        document.getElementById(h_id).style.display = 'none';
        event.classList.remove(_class);
      } else{
        document.getElementById(col).style.display = 'block';
        document.getElementById(_class).style.display = 'none';
        document.getElementById(h_id).style.display = 'block';
        event.classList.add(_class);
      }
    }
  }

  share(via='facebook', message=null, url=null, image=null) {//
    let appnames = {
      'facebook': `http://www.facebook.com/sharer.php?message=${message}&url=${url}`,
      'twitter': `https://twitter.com/share?text=${message}&url=${url}`
    };
    if(this.platform.is('core') || !this.socialSharing.canShareVia(via)){
      window.open(appnames[via], '_blank');
    } else {
      this.socialSharing.shareVia(via, message);
    }
  }

}
