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
    selector: 'app-dashboard2',
    templateUrl: './dashboard2.component.html',
    styleUrls: ['./dashboard2.component.css'],
    providers: [MessageService]
})

export class Dashboard2Component {
    modalReference: NgbModalRef;
    step1Form: FormGroup;
    modelData: any = {};
    selectedCar: any;
    data: any[];
    closeResult: string;
    cols: any[];
    msgs: Message[] = [];
    isDelete: boolean = false;
    results: string[];
    constructor(private _http: HttpClient, private messageService: MessageService, private modalService: NgbModal) {
        this.step1Form = new FormGroup({
            MediaId: new FormControl('', [
                Validators.required
            ]),
            FileName: new FormControl('', [
            ]),
            FileExtension: new FormControl('', [
            ]),
            FileLocation: new FormControl('', [
            ]),
            WebLocation: new FormControl('', [
            ]),
            Thumbnail: new FormControl('', [
                Validators.required
            ]),
            InHomeDisplay: new FormControl('', [
                Validators.required
            ]),
            VendorCode: new FormControl('', [
                Validators.required
            ]),
            MediaLocation: new FormControl('', [
            ]),
            VendorId: new FormControl('', [
            ]),
        });
        this.cols = [
            { field: 'MediaLocation', header: 'MediaLocation' },
            { field: 'MediaId', header: 'MediaId' },
            { field: 'VendorCode', header: 'VendorCode' }
            // { field: 'FileName', header: 'FileName' },
            // { field: 'FileExtension', header: 'FileExtension' },
            // { field: 'FileLocation', header: 'FileLocation' },
            // { field: 'WebLocation', header: 'WebLocation' }
        ];
        this.getMediaLocation()
            .subscribe(data => {
                this.data = data;
            });

    }

    base64textString: any = '';

    onUploadChange(evt: any) {
        const file = evt.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = this.handleReaderLoaded.bind(this);
            reader.readAsBinaryString(file);
        }
    }

    handleReaderLoaded(e) {
        this.base64textString = btoa(e.target.result);
        console.log(this.base64textString)
    }

    search(event) {
        this.getMediaId(event.query)
            .subscribe(data => {
                this.results = data;
            });
    }

    getMediaId(search) {
        return Observable.create((observer) => {
            return this._http.get('http://70.35.198.86/BM.Liv26.AppLayer/MediaSearchbyTitle/' + search)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getMediaLocation() {
        return Observable.create((observer) => {
            return this._http.get('http://70.35.198.86/BM.Liv26.AppLayer/MediaLocation')
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
        console.log(this.modelData)
        this.step1Form.controls['MediaLocation'].setValue(this.modelData.MediaLocation);
        this.step1Form.controls['MediaId'].setValue(this.modelData.MediaId);
        this.step1Form.controls['FileName'].setValue(this.modelData.FileName);
        this.step1Form.controls['FileExtension'].setValue(this.modelData.FileExtension);
        this.step1Form.controls['FileLocation'].setValue(this.modelData.FileLocation);
        this.step1Form.controls['VendorCode'].setValue(this.modelData.VendorCode);
        this.step1Form.controls['WebLocation'].setValue(this.modelData.WebLocation);
        //this.step1Form.controls['Thumbnail'].setValue(this.modelData.Thumbnail);
        this.step1Form.controls['InHomeDisplay'].setValue(this.modelData.InHomeDisplay);
        this.step1Form.controls['VendorId'].setValue(this.modelData.VendorId);
        this.getMediaId('')
            .subscribe(data => {
                this.results = data.filter(a => a.MediaId == this.modelData.MediaId);
            });
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
        if (f.MediaLocation) {
            this.updateMediaLocation(this.step1Form.value)
                .subscribe(data => {
                    if (data.MediaLocation) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Video updated Successfully' });
                        this.modalReference.close();
                        this.getMediaLocation()
                            .subscribe(data => {
                                this.data = data;
                            });
                    }
                });
        } else {
            this.addMediaLocation(this.step1Form.value)
                .subscribe(data => {
                    if (data.MediaLocation) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Video added Successfully' });
                        this.modalReference.close();
                        this.getMediaLocation()
                            .subscribe(data => {
                                this.data = data;
                            });
                    }
                });
        }

    }

    deletevideo() {
        if (confirm("Are you sure you want to delete this record?")) {
            this.deleteMediaLocation(this.step1Form.value)
                .subscribe(data => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Video deleted Successfully' });
                    this.modalReference.close();
                    this.getMediaLocation()
                        .subscribe(data => {
                            this.data = data;
                        });
                    this.step1Form.reset();
                });
        }
    }

    addMediaLocation(form) {
        const body = JSON.stringify({
            "MediaId": form.MediaId.MediaId,
            // "FileName": form.FileName,
            // "FileExtension": form.FileExtension,
            // "FileLocation": form.FileLocation,
            "VendorCode": form.VendorCode,
            "IsActive": true,
            "WebLocation": "",
            "Thumbnail": this.base64textString,
            "InHomeDisplay": form.InHomeDisplay,
            "VendorId": form.VendorId,
            "IsRecordOk": true,
            "ErrorMessages": null
        })
        console.log(body)
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post('http://70.35.198.86/BM.Liv26.AppLayer/MediaLocation/' + form.MediaId.MediaId, body, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
                    });
        });
    }

    updateMediaLocation(form) {
        const body = JSON.stringify({
            "MediaLocation": form.MediaLocation,
            "MediaId": form.MediaId.MediaId,
            // "FileName": form.FileName,
            // "FileExtension": form.FileExtension,
            // "FileLocation": form.FileLocation,
            "VendorCode": form.VendorCode,
            "IsActive": true,
            "WebLocation": "",
            "Thumbnail": this.base64textString,
            "InHomeDisplay": form.InHomeDisplay,
            "VendorId": form.VendorId,
            "IsRecordOk": true,
            "ErrorMessages": null
        })
        console.log(body)
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post('http://70.35.198.86/BM.Liv26.AppLayer/MediaLocation/' + form.MediaId.MediaId + '/Update', body, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
                    });
        });
    }

    deleteMediaLocation(form) {
        const body = JSON.stringify({
            "MediaLocation": form.MediaLocation,
            "MediaId": form.MediaId.MediaId,
            "FileName": form.FileName,
            "FileExtension": form.FileExtension,
            "FileLocation": form.FileLocation,
            "VendorCode": form.VendorCode,
            "IsActive": true,
            "WebLocation": form.WebLocation,
            "Thumbnail": form.Thumbnail,
            "InHomeDisplay": form.InHomeDisplay,
            "VendorId": form.VendorId,
            "IsRecordOk": true,
            "ErrorMessages": null
        })
        console.log(body)
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post('http://70.35.198.86/BM.Liv26.AppLayer/MediaLocation/' + form.MediaLocation + '/' + form.MediaId.MediaId + '/Remove', body, { headers: headers })
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
