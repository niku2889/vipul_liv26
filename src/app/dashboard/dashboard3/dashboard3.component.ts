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

export interface LazyLoadEvent {
    first?: number;
    rows?: number;
    sortField?: string;
    sortOrder?: number;
    filters?: { [s: string]: FilterMetadata; };
}

export interface FilterMetadata {
    value?: string;
    matchMode?: string;
}
@Component({
    selector: 'app-dashboard3',
    templateUrl: './dashboard3.component.html',
    styleUrls: ['./dashboard3.component.scss'],
    providers: [MessageService]
})

export class Dashboard3Component {
    test: FilterMetadata;
    modalReference: NgbModalRef;
    load: LazyLoadEvent;
    step1Form: FormGroup;
    step2Form: FormGroup;
    step3Form: FormGroup;
    modelData: any = {};
    selectedCar: any;
    data: any[];
    categoryData: any[];
    languageData: any[];
    closeResult: string;
    cols: any[];
    msgs: Message[] = [];
    isDelete: boolean = false;
    totalRecords: number;
    loading: boolean;
    datasource: any[];
    categoryName: string;
    pageNo: number = 0;
    title: string = '';
    results: string[];

    constructor(private _http: HttpClient, private messageService: MessageService, private modalService: NgbModal) {
        this.step1Form = new FormGroup({
            Description: new FormControl('', [
            ]),
            Title: new FormControl('', [
                Validators.required
            ]),
            MediaType: new FormControl('', [
            ]),
            MediaCategory: new FormControl('', [
                Validators.required
            ]),
            UploadedBy: new FormControl('', [

            ]),
            MediaLocation: new FormControl('', [
            ]),
            MediaLength: new FormControl('', [
            ]),
            Language: new FormControl('', [
            ]),
            DisplayOrder: new FormControl('', [
            ]),
            Playlist: new FormControl('', [
            ]),
            MediaId: new FormControl('', [
            ]),
            NoOfShares: new FormControl('', [
            ]),
            NoOfLikes: new FormControl('', [
            ]),
            NoOfDisplayed: new FormControl('', [
            ]),
            UploadedDate: new FormControl('', [
            ]),
        });
        this.step2Form = new FormGroup({
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

        this.step3Form = new FormGroup({
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
        this.step1Form.controls['Language'].setValue('1', { onlySelf: true });
        this.cols = [
            { field: 'Title', header: 'Title' },
            { field: 'MediaType', header: 'MediaType' },
            { field: 'MediaCategory', header: 'MediaCategory' },
            { field: 'UploadedBy', header: 'UploadedBy' },
            { field: 'PlayList', header: 'PlayList' },
            { field: 'NoOfShares', header: 'NoOfShares' },
            { field: 'NoOfLikes', header: 'NoOfLikes' },
            { field: 'NoOfDisplayed', header: 'NoOfDisplayed' }

        ];
        this.loading = true;
        this.getMedia(0)
            .subscribe(data => {
                this.datasource = data['TopMedia'];
                this.totalRecords = data['TotalCount'];
                this.loading = false;
            });
        this.getCategory()
            .subscribe(data => {
                this.categoryData = data;
            });
        this.getLanguage()
            .subscribe(data => {
                this.languageData = data;
            });

    }

    loadCarsLazy(event: LazyLoadEvent) {
        this.loading = true;
        if (event) {
            var digits = ("" + event.first).split("");
            this.pageNo = Number(event.first.toString().substring(0, event.first.toString().length - 1));
            let fil = event.filters.global ? event.filters.global : '';
            if (fil) {
                setTimeout(() => {
                    if (this.datasource) {
                        this.getMediaSearch(this.pageNo, event.filters.global.value)
                            .subscribe(data => {
                                this.datasource = data['TopMedia'];
                                this.totalRecords = data['TotalCount'] ;
                                this.loading = false;
                            });
                        this.loading = false;
                    }
                }, 1000);
            } else {
                setTimeout(() => {
                    if (this.datasource) {
                        this.getMedia(this.pageNo)
                            .subscribe(data => {
                                this.datasource = data['TopMedia'];
                                this.totalRecords = data['TotalCount'] - 20;
                                this.loading = false;
                            });
                        this.loading = false;
                    }
                }, 1000);
            }
        } else {
            this.pageNo = 0;
            setTimeout(() => {
                if (this.datasource) {
                    this.getMedia(this.pageNo)
                        .subscribe(data => {
                            this.datasource = data['TopMedia'];
                            this.totalRecords = data['TotalCount'] - 20;
                            this.loading = false;
                        });
                    this.loading = false;
                }
            }, 1000);

        }


    }
    getMedia(no) {
        return Observable.create((observer) => {
            return this._http.get('http://70.35.198.86/BM.Liv26.AppLayer/TopVideo?StartRow=' + no + '&PageSize=10&CategoryId=1')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }
    getMediaSearch(no, text) {
        return Observable.create((observer) => {
            return this._http.get('http://70.35.198.86/BM.Liv26.AppLayer/MediaSearch?StartRow=' + no + '&PageSize=10&SearchMedia=' + text)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getCategory() {
        return Observable.create((observer) => {
            return this._http.get('http://70.35.198.86/BM.Liv26.AppLayer/Category')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    changeCategory(name) {
        this.categoryName = name;
    }

    getLanguage() {
        return Observable.create((observer) => {
            return this._http.get('http://70.35.198.86/BM.Liv26.AppLayer/Language')
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
        if (type != 'mapping' && type != 'location') {
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
        } else {
            this.step2Form.reset();
            this.modalReference = this.modalService.open(content);
            this.modalReference.result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
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

    search1(event) {
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

    search(event) {
        this.getPlaylist(event.query)
            .subscribe(data => {
                this.results = data;
            });
    }

    getPlaylist(search) {
        return Observable.create((observer) => {
            return this._http.get(' http://70.35.198.86/BM.Liv26.AppLayer/MediaPlaylist/' + search)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    addLocation() {
        this.addMediaLocation(this.step3Form.value)
            .subscribe(data => {
                if (data.MediaLocation) {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Video added Successfully' });
                    this.modalReference.close();
                   
                }
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
    }


    addMediaLocation(form) {
        const body = JSON.stringify({
            "MediaId": form.MediaId.MediaId,
            "VendorCode": form.VendorCode,
            "IsActive": true,
            "WebLocation": "",
            "Thumbnail": this.base64textString,
            "InHomeDisplay": form.InHomeDisplay,
            "VendorId": form.VendorId,
            "IsRecordOk": true,
            "ErrorMessages": null
        })
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

    onRowSelect(event, action, content) {
        this.modelData = this.cloneCar(event.data);
        let cateId: any = this.categoryData.filter(a => a.CategoryName == this.modelData.MediaCategory);
        console.log(cateId)
        this.step1Form.controls['Description'].setValue(this.modelData.Description);
        this.step1Form.controls['Title'].setValue(this.modelData.Title);
        this.step1Form.controls['MediaType'].setValue(this.modelData.MediaType);
        if (cateId.length > 0)
            this.step1Form.controls['MediaCategory'].setValue(cateId[0].CategoryId == null ? '' : cateId[0].CategoryId);
        this.step1Form.controls['UploadedBy'].setValue(this.modelData.UploadedBy);
        this.step1Form.controls['MediaLocation'].setValue(this.modelData.MediaLocation);
        this.step1Form.controls['MediaLength'].setValue(this.modelData.MediaLength);
        this.step1Form.controls['Language'].setValue(this.modelData.Language == null ? '' : this.modelData.Language);
        this.step1Form.controls['DisplayOrder'].setValue(this.modelData.DisplayOrder);
        this.step1Form.controls['Playlist'].setValue(this.modelData.PlayList);
        this.step1Form.controls['MediaId'].setValue(this.modelData.MediaId);
        this.step1Form.controls['NoOfShares'].setValue(this.modelData.NoOfShares);
        this.step1Form.controls['NoOfLikes'].setValue(this.modelData.NoOfLikes);
        this.step1Form.controls['NoOfDisplayed'].setValue(this.modelData.NoOfDisplayed);
        this.step1Form.controls['UploadedDate'].setValue(this.modelData.UploadedDate);
        if (cateId.length > 0)
            this.step1Form.controls['MediaCategory'].setValue(cateId[0].CategoryId == null ? '' : cateId[0].CategoryId, { onlySelf: true });
        this.open(content, action)
    }

    onMappingSelect(event, action, content) {
        this.title = event;
        this.open(content, action)
    }

    onLocationSelect(event, action, content) {
        this.title = event;
        this.open(content, action)
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
        if (f.MediaId) {
            this.updateMedia(this.step1Form.value)
                .subscribe(data => {
                    if (data.MediaId) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Media updated Successfully' });
                        this.modalReference.close();
                        this.loadCarsLazy(this.load);

                    }
                });
        } else {
            this.addMedia(this.step1Form.value)
                .subscribe(data => {
                    if (data.MediaId) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Media added Successfully' });
                        this.modalReference.close();
                        this.loadCarsLazy(this.load);
                    }
                });
        }

    }

    addMapping() {
        this.addMappingVideo(this.step2Form.value)
            .subscribe(data => {
                if (data.ClientVideoId) {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Video added Successfully' });
                    this.modalReference.close();
                }
            });
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

    deleteMedia1() {
        if (confirm("Are you sure you want to delete this record?")) {
            this.deleteMedia(this.step1Form.value)
                .subscribe(data => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Media deleted Successfully' });
                    this.modalReference.close();
                    this.loadCarsLazy(this.load);
                    this.step1Form.reset();
                });
        }
    }

    addMedia(form) {
        const body = JSON.stringify({
            "Description": form.Description,
            "Title": form.Title,
            "MediaType": form.MediaType,
            "MediaCategory": {
                "CategoryId": form.MediaCategory,
                "CategoryName": this.categoryName
            },
            "UploadedBy": form.UploadedBy,
            "MediaLocation": form.MediaLocation,
            "MediaLength": form.MediaLength,
            "IsActive": true,
            "Language": form.Language,
            "DisplayOrder": form.DisplayOrder,
            "Playlist": form.Playlist
        })
        console.log(body)
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post('http://70.35.198.86/BM.Liv26.AppLayer/Media', body, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
                    });
        });
    }

    updateMedia(form) {
        const body = JSON.stringify({
            "MediaId": form.MediaId,
            "Description": form.Description,
            "Title": form.Title,
            "MediaType": form.MediaType,
            "MediaCategory": {
                "CategoryId": form.MediaCategory,
                "CategoryName": "test"
            },
            "UploadedBy": form.UploadedBy,
            "MediaLocation": form.MediaLocation,
            "MediaLength": form.MediaLength,
            "IsActive": true,
            "Language": form.Language,
            "DisplayOrder": form.DisplayOrder,
            "Playlist": form.Playlist
        })
        console.log(body)
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post('http://70.35.198.86/BM.Liv26.AppLayer/Media/Update', body, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
                    });
        });
    }

    deleteMedia(form) {
        console.log(form)
        const body = JSON.stringify({
            "MediaId": form.MediaId,
            "Description": form.Description,
            "Title": form.Title,
            "MediaType": form.MediaType,
            "MediaCategory": {
                "CategoryId": form.MediaCategory,
                "CategoryName": "test"
            },
            "UploadedBy": form.UploadedBy,
            "MediaLocation": form.MediaLocation,
            "MediaLength": form.MediaLength,
            "IsActive": true,
            "Language": form.Language,
            "DisplayOrder": form.DisplayOrder,
            "Playlist": form.Playlist
        })
        console.log(body)
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post('http://70.35.198.86/BM.Liv26.AppLayer/Media/' + form.MediaId + '/Remove', body, { headers: headers })
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
