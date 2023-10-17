import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-singlephoto',
  templateUrl: './singlephoto.component.html',
  styleUrls: ['./singlephoto.component.css']
})
export class SinglephotoComponent implements OnInit {

  photoId : string | null = null;
  galId : string | null = null;


  constructor(public route : ActivatedRoute, public http:HttpClient) { }

  ngOnInit() {
    // TO DO: [Étape 4] Il faut récupérer l'id de l'image qui va être utilisé pour obtenir l'image haute résolution du serveur
    this.photoId = this.route.snapshot.paramMap.get("id");
    this.galId = this.route.snapshot.paramMap.get("galid");

  }

}
