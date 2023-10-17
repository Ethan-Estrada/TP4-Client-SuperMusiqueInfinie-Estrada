import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GalleryService } from '../services/gallery.service';
import { Gallery } from '../models/gallery';
import { lastValueFrom } from 'rxjs';
import { Photo } from '../models/photo';
import { HttpClient } from '@angular/common/http';
import Glide from '@glidejs/glide';


@Component({
  selector: 'app-myGalleries',
  templateUrl: './myGalleries.component.html',
  styleUrls: ['./myGalleries.component.css']
})
export class MyGalleriesComponent implements OnInit {

  selectedGallery : Gallery | null = null;
  newOwner : string = "";
  name : string = "";
  isPublic : boolean = false;

  public selectedItem:any = {};

  photos : Photo[] = [];
  gallerys : Gallery[] = [];

  @ViewChild("fileUploadViewChild", {static:false}) photoInput ?: ElementRef;
  @ViewChild("fileUploadGallery", {static:false}) galleryInput ?: ElementRef;
  @ViewChild("fileUploadNewGallery", {static:false}) newGalleryInput ?: ElementRef;


  @ViewChildren('glideitems') glideitems : QueryList<any> = new QueryList();
  galleryId?: number;

  constructor(public gallery : GalleryService, public http:HttpClient) { }

  async ngOnInit() : Promise<void> {
    this.getGalleries();
  }

  ngAfterViewInit() {     this.glideitems.changes.subscribe(e => {
          this.initGlide();
        });
        if(this.glideitems.length > 0) {
          this.initGlide();
        }
      }

    initGlide() {
          var glide = new Glide('.glide', {
            type: 'carousel',
            focusAt: 'center',
            perView: Math.ceil(window.innerWidth / 800)
          });
          glide.mount();
        }

  selectGallery(g : Gallery){
    this.photos.splice(0);
    this.selectedGallery = g;
    this.galleryId = g.id;
    this.selectedItem = g;
    this.getPhotos();

    console.log("LE ID DE LA GALERIE EST : "+this.galleryId);
  }

  async newGallery():Promise<void>{
    if(this.galleryInput == undefined){
      console.log("Input HTML non chargé.");
      return;
    }

    let file = this.galleryInput?.nativeElement.files[0];
    if(file == null){
      console.log("Input HTML ne contient aucune image.");
      return;
    }
    let formData = new FormData();
    formData.append("monGallery",file, file.name);
    let newGallery = await lastValueFrom(this.http.post<Gallery>("https://localhost:7217/api/Galleries/PostGallery/"+this.name,formData));
    console.log(newGallery);
  }

  async putGallery():Promise<void>{
    if(this.newGalleryInput == undefined){
      console.log("Input HTML non chargé.");
      return;
    }

    let file = this.newGalleryInput?.nativeElement.files[0];
    if(file == null){
      console.log("Input HTML ne contient aucune image.");
      return;
    }
    let formData = new FormData();
    formData.append("monNewGallery",file, file.name);
    let newGallery = await lastValueFrom(this.http.put<Gallery>("https://localhost:7217/api/Galleries/PutGallery/"+this.galleryId,formData));
    console.log(newGallery);
  }

  async getGalleries(): Promise<void>{
    this.gallerys = await lastValueFrom(this.http.get<Gallery[]>("https://localhost:7217/api/Galleries/GetMyGalleries"));
  }

  async uploadPhoto(): Promise<void> {
    if(this.photoInput == undefined){
      console.log("Input HTML non chargé.");
      return;
    }

    let file = this.photoInput?.nativeElement.files[0];
    if(file == null){
      console.log("Input HTML ne contient aucune image.");
      return;
    }
    let formData = new FormData();
    formData.append("monImage",file, file.name);
    let newPicture = await lastValueFrom(this.http.post<Photo>("https://localhost:7217/api/Photos/PostPhoto/"+this.galleryId,formData));
    this.photos.push(newPicture);
    console.log(newPicture);
  }

  async getPhotos(): Promise<void> {
    this.photos = await lastValueFrom(this.http.get<Photo[]>("https://localhost:7217/api/Photos/GetPhoto/"+this.galleryId));
    console.log(this.photos);
  }

  async deletePhoto(photo:Photo): Promise<void> {
   await lastValueFrom(this.http.delete<any>("https://localhost:7217/api/Photos/DeletePhoto/"+this.galleryId+'/'+photo.id));
    await this.getPhotos();
  }

}
