import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { ConstantsService } from './constants.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

	server = [];
	unityPackages = [];
	otherDownloads = [];
	assetPackages = [];
	testVersions = [];
	disabledVersions = [];
	paginate:number = 0;

	downloadType = {
 			'Atavism Server': 'Atavism Server',
 			'Atavism Unity Packages': 'Unity',
 			'Other Atavism Downloads': 'Other',
 			'Asset Packages': 'Asset',
 			'Test Version Downloads': 'Test',
 			'Admin Disabled Version Downloads': 'Disabled'
 	};

 	constructor(private http: HttpClient, private constants: ConstantsService, private services: CommonService) { }

 	getDownloads(type,downloadType,paginate,page,search): Promise<any[]> {

 		const key = this.downloadType[type];
 		// console.log("key",key);
 		// return this.http.post < any > (this.constants.DOWNLOADS,{type:key,downloadType:downloadType,paginate:paginate,page:page,search:search});

		if (this.paginate != paginate) {
			this.server = [];
			this.unityPackages = [];
			this.otherDownloads = [];
			this.assetPackages = [];
			this.testVersions = [];
			this.disabledVersions = [];
 		} else {
 			const downloads:any[] = this.getData(key);
 			if (downloads.length > 0) {
 				return new Promise((resolve, reject) => {
 					// console.log("downloads",downloads);
 					resolve(downloads);
        		});
 				// return downloads?downloads:[];
 				// return this.http.post < any > (this.constants.DOWNLOADS,{type:type,downloads:downloads,paginate:paginate,page:page,search:search});
 			}
 		}

 		this.services.getDownloads(key, downloadType, paginate,page,search).subscribe(res => {
 			if (key === 'Atavism Server') {
 				this.server = res.data;
 			} else if (key === 'Unity') {
 				this.unityPackages === res.data;
 			} else if (key === 'Other') {
 				this.otherDownloads === res.data;
 			} else if (key === 'Asset') {
 				this.assetPackages === res.data;
 			} else if (key === 'Test') {
 				this.testVersions === res.data;
 			} else if (key === 'Disabled') {
 				this.disabledVersions === res.data;
 			}

 			this.paginate = paginate;

 			return new Promise((resolve, reject) => {
          			resolve(res.data);
        	});
      		// this.downloads = res.data;
      		// this.dataSource = this.downloads.downloads;
      		// this.user_role = res.data.user_role;
      		// this.isLoading = false;
    	});
    	// return [];
 		// return this.http.post < any > (this.constants.DOWNLOADS,{type:key,downloadType:downloadType,paginate:paginate,page:page,search:search});
 	}

 	getData(key){
 		if (this.downloadType[key] === 'Atavism Server') {
 				return this.server;
 			} else if (this.downloadType[key] === 'Unity') {
 				return this.unityPackages;
 			} else if (this.downloadType[key] === 'Other') {
 				return this.otherDownloads;
 			} else if (this.downloadType[key] === 'Asset') {
 				return this.assetPackages;
 			} else if (this.downloadType[key] === 'Test') {
 				return this.testVersions;
 			} else if (this.downloadType[key] === 'Disabled') {
 				return this.disabledVersions;
 			}
 		// return [];
 	}
}

