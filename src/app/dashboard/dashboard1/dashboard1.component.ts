import { Component, ViewEncapsulation, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
declare var require: any;
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

const data: any = require('../../shared/data/chartist.json');

export class NgbdModalContent {
    @Input() name;
    constructor(public activeModal: NgbActiveModal) { }
    OnSubmit() {
        this.activeModal.close(); //It closes successfully
    }

}

@Component({
    selector: 'app-dashboard1',
    templateUrl: './dashboard1.component.html',
    styleUrls: ['./dashboard1.component.scss'],
    providers: [MessageService]
})

export class Dashboard1Component {
    modalReference: NgbModalRef;
    step1Form: FormGroup;
    modelData: any = {};
    selectedCar: any;
    data: any[];
    closeResult: string;
    cols: any[];
    msgs: Message[] = [];
    isDelete: boolean = false;
    constructor(private _http: HttpClient, private messageService: MessageService, private modalService: NgbModal) {
        this.step1Form = new FormGroup({
            Client: new FormControl('', [
                Validators.required
            ]),
            VideoId: new FormControl('', [
                Validators.required
            ]),
            VideoLink: new FormControl('', [
                Validators.required
            ]),
            ThumbnailLink: new FormControl('', [
                Validators.required
            ]),
            Quality: new FormControl('', [
                Validators.required
            ]),
            VideoType: new FormControl('', [
                Validators.required
            ]),
            DateAdded: new FormControl('', [

            ]),
            ReleaseDate: new FormControl('', [

            ]),
            ClientVideoId: new FormControl('', [

            ]),
        });
        this.cols = [
            { field: 'ClientVideoId', header: 'ClientVideoId' },
            { field: 'Client', header: 'Client' },
            { field: 'VideoId', header: 'VideoId' },
            // { field: 'VideoLink', header: 'VideoLink' },
            // { field: 'ThumbnailLink', header: 'ThumbnailLink' },
            { field: 'Quality', header: 'Quality' },
            { field: 'VideoType', header: 'VideoType' },
            { field: 'DateAdded', header: 'DateAdded' },
            { field: 'ReleaseDate', header: 'ReleaseDate' }
        ];
        this.getMappingVideo()
            .subscribe(data => {
                this.data = data;
            });

    }

    getMappingVideo() {
        return Observable.create((observer) => {
            return this._http.get('http://70.35.198.86/BM.Liv26.AppLayer/MappingVideo')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    // Open default modal
    open(content, type) {
        if (type == 'add') {
            this.step1Form.reset();
            this.isDelete = false;
        } else {
            this.isDelete = true;
        }
        this.modalReference = this.modalService.open(content);
        this.modalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    // This function is used in open
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }


    onRowSelect(event, content) {
        this.modelData = this.cloneCar(event.data);
        this.step1Form.controls['ClientVideoId'].setValue(this.modelData.ClientVideoId);
        this.step1Form.controls['Client'].setValue(this.modelData.Client);
        this.step1Form.controls['VideoId'].setValue(this.modelData.VideoId);
        this.step1Form.controls['VideoLink'].setValue(this.modelData.VideoLink);
        this.step1Form.controls['ThumbnailLink'].setValue(this.modelData.ThumbnailLink);
        this.step1Form.controls['Quality'].setValue(this.modelData.Quality);
        this.step1Form.controls['VideoType'].setValue(this.modelData.VideoType);
        this.step1Form.controls['DateAdded'].setValue(this.modelData.DateAdded);
        this.step1Form.controls['ReleaseDate'].setValue(this.modelData.ReleaseDate);
        this.open(content, 'edit')
    }

    cloneCar(m): any {
        let d = {};
        for (let prop in m) {
            d[prop] = m[prop];
        }
        return d;
    }

    step1() {
        let f = this.step1Form.value;
        if (f.ClientVideoId) {
            this.updateMappingVideo(this.step1Form.value)
                .subscribe(data => {
                    if (data.ClientVideoId) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Video updated Successfully' });
                        this.modalReference.close();
                        this.getMappingVideo()
                            .subscribe(data => {
                                this.data = data;
                            });
                    }
                });
        } else {
            this.addMappingVideo(this.step1Form.value)
                .subscribe(data => {
                    if (data.ClientVideoId) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Video added Successfully' });
                        this.modalReference.close();
                        this.getMappingVideo()
                            .subscribe(data => {
                                this.data = data;
                            });
                    }
                });
        }

    }

    deletevideo() {
        if (confirm("Are you sure you want to delete this record?")) {
            this.deleteMappingVideo(this.step1Form.value)
                .subscribe(data => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Video deleted Successfully' });
                    this.modalReference.close();
                    this.getMappingVideo()
                        .subscribe(data => {
                            this.data = data;
                        });
                    this.step1Form.reset();
                });
        }
    }

    addMappingVideo(form) {
        const body = JSON.stringify({
            "Client": form.Client,
            "VideoId": form.VideoId,
            "VideoLink": form.VideoLink,
            "ThumbnailLink": form.ThumbnailLink,
            "Quality": form.Quality,
            "VideoType": form.VideoType,
            "DateAdded": new Date(),
            "ReleaseDate": new Date(),
            "IsRecordOk": true,
            "ErrorMessages": null
        })
        console.log(body)
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post('http://70.35.198.86/BM.Liv26.AppLayer/MappingVideo', body, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
                    });
        });
    }

    updateMappingVideo(form) {
        const body = JSON.stringify({
            "ClientVideoId": form.ClientVideoId,
            "Client": form.Client,
            "VideoId": form.VideoId,
            "VideoLink": form.VideoLink,
            "ThumbnailLink": form.ThumbnailLink,
            "Quality": form.Quality,
            "VideoType": form.VideoType,
            "DateAdded": new Date(),
            "ReleaseDate": new Date(),
            "IsRecordOk": true,
            "ErrorMessages": null
        })
        console.log(body)
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post('http://70.35.198.86/BM.Liv26.AppLayer/MappingVideo/Update', body, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
                    });
        });
    }

    deleteMappingVideo(form) {
        const body = JSON.stringify({
            "ClientVideoId": form.ClientVideoId,
            "Client": form.Client,
            "VideoId": form.VideoId,
            "VideoLink": form.VideoLink,
            "ThumbnailLink": form.ThumbnailLink,
            "Quality": form.Quality,
            "VideoType": form.VideoType,
            "DateAdded": new Date(),
            "ReleaseDate": new Date(),
            "IsRecordOk": true,
            "ErrorMessages": null
        })
        console.log(body)
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post('http://70.35.198.86/BM.Liv26.AppLayer/MappingVideo/' + form.ClientVideoId + '/Remove', body, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        let error = err.Errors;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
                    });
        });
    }
}
