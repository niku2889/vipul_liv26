import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Urls } from './urls';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { stringify, parse } from 'querystring';

@Injectable()
export class SoilService {

  constructor(private _http: HttpClient) {
  }

  getUnites() {
    return Observable.create((observer) => {
      return this._http.get(Urls.unites)
        .subscribe(data => {
          observer.next(data);
        },
          err => {
            console.error(err);
          });
    });
  }

  getExtraction() {
    return Observable.create((observer) => {
      return this._http.get(Urls.extraction)
        .subscribe(data => {
          observer.next(data);
        },
          err => {
            console.error(err);
          });
    });
  }

  getNutrients() {
    return Observable.create((observer) => {
      return this._http.get(Urls.nutrients)
        .subscribe(data => {
          observer.next(data);
        },
          err => {
            console.error(err);
          });
    });
  }

  getCrops(userid, token) {
    const body = JSON.stringify({
      "userId": userid,
      "token": token
    })
    let headers = new HttpHeaders();
    headers = headers.set('content-Type', 'application/json;charset=utf-8');
    return Observable.create((observer) => {
      return this._http.post(Urls.crops, body, { headers: headers })
        .subscribe(data => {
          observer.next(data);
        },
          err => {
            console.error(err);
          });
    });
  }


  getVarieties(userid, token, cropid) {
    const body = JSON.stringify({
      "userId": userid,
      "token": token,
      "cropId": cropid
    })
    let headers = new HttpHeaders();
    headers = headers.set('content-Type', 'application/json;charset=utf-8');
    return Observable.create((observer) => {
      return this._http.post(Urls.varieties, body, { headers: headers })
        .subscribe(data => {
          observer.next(data);
        },
          err => {
            console.error(err);
          });
    });
  }

  postLogin() {
    const body = JSON.stringify({
    })
    let headers = new HttpHeaders();
    headers = headers.set('content-Type', 'application/json;charset=utf-8');
    return Observable.create((observer) => {
      return this._http.post(Urls.login, body, { headers: headers })
        .subscribe(data => {
          observer.next(data);
        },
          err => {
            console.error(err);
          });
    });
  }

  postValidateToken(userid, token) {
    const body = JSON.stringify({
      "userId": userid,
      "token": token
    })
    let headers = new HttpHeaders();
    headers = headers.set('content-Type', 'application/json;charset=utf-8');
    return Observable.create((observer) => {
      return this._http.post(Urls.validateToken, body, { headers: headers })
        .subscribe(data => {
          observer.next(data);
        },
          err => {
            console.error(err);
          });
    });
  }

  signupSF(form1) {
    const body = JSON.stringify({
      "firstname": form1.firstName,
      "lastname": form1.lastName,
      "email": form1.email,
      "country": form1.country
    })
    let headers = new HttpHeaders();
    headers = headers.set('content-Type', 'application/json;charset=utf-8');
    return Observable.create((observer) => {
      return this._http.post(Urls.signup, body, { headers: headers })
        .subscribe(data => {
          observer.next(data);
        },
          err => {
            console.error(err);
          });
    });
  }

  updateSF(sf, cronpname) {
    const body = JSON.stringify({
      "accountId": sf.accountId,
      "contactId": sf.contactId,
      "cropName": cronpname
    })
    let headers = new HttpHeaders();
    headers = headers.set('content-Type', 'application/json;charset=utf-8');
    return Observable.create((observer) => {
      return this._http.post(Urls.updatecustomer, body, { headers: headers })
        .subscribe(data => {
          observer.next(data);
        },
          err => {
            //console.error(err);
          });
    });
  }

  postConvertionValue(form3, nutrient) {
    let nutri = '';
    if (form3.nutrient.toString().indexOf("NO3") > -1 || form3.nutrient.toString().indexOf("NH4") > -1 || form3.nutrient.toString().indexOf("NH2") > -1) {
      nutri = "n";
    } else if (form3.nutrient.toString().indexOf("PO4") > -1 || form3.nutrient.toString().indexOf("P2O5") > -1 || form3.nutrient.toString().indexOf("H2PO4") > -1) {
      nutri = "p";
    } else if (form3.nutrient.toString().indexOf("K2O") > -1) {
      nutri = "k";
    } else if (form3.nutrient.toString().indexOf("CaO") > -1 || form3.nutrient.toString().indexOf("CaCO3") > -1) {
      nutri = "ca";
    } else if (form3.nutrient.toString().indexOf("MgO") > -1 || form3.nutrient.toString().indexOf("MgCO3") > -1) {
      nutri = "mg";
    } else if (form3.nutrient.toString().indexOf("SO4") > -1) {
      nutri = "s";
    }
    else {
      nutri = form3.nutrient.toString().replace(0, 'o').toLowerCase();
    }
    const body = JSON.stringify({
      "nutrient": nutrient.toString().toLowerCase(),
      "value": form3.value,
      "currentNutrientForm": form3.nutrient.toString().replace(0, 'o'),
      "toNutrientForm": nutri,
      "fromUnit": form3.nutrientUnit,
      "toUnit": "ppm",
      "layerDepth": 20,
      "bulkDensity": 1.2,
      "yieldAreaUnitId": 20
    })
    let headers = new HttpHeaders();
    headers = headers.set('content-Type', 'application/json;charset=utf-8');
    return Observable.create((observer) => {
      return this._http.post(Urls.convertion, body, { headers: headers })
        .subscribe(data => {
          observer.next(data);
        },
          err => {
            console.error(err);
          });
    });
  }

  postReport(form1, form2, form3, convertData, cropId, userid, token) {
    const body = JSON.stringify({
      "userId": userid,
      "token": token,
      "Crop": {
        "CropId": Number(cropId),
        "VarietyId": Number(form2.variety ? form2.variety : 1),
        "YieldGoalId": 1,
        "plantingDate": ""
      },
      "Farmer": {
        "Email": form1.email,
        "FirstName": form1.firstName,
        "LastName": form1.lastName,
        "Phone": "null",
        "State": "null",
        "Zip": "null",
        "Country": form1.country
      },
      // "Fertilizers": {
      //   "Fertilizer": [
      //     {
      //       "Id": 8173,
      //       "FertilizerId": 8173,
      //       "AcidConcentration": "0"
      //     }
      //   ]
      // },
      "Plot": {
        "FarmName": form1.firstName + '_' + form1.lastName,
        "LocationGEO": {
          "features": [
            {
              "geometry": {
                "coordinates": [
                  -100.41402518749238,
                  48.0781936333024
                ],
                "type": "Point"
              },
              "properties": {},
              "type": "Feature"
            }
          ],
          "type": "FeatureCollection"
        },
        "PlotArea": Number(form2.plotSize),
        "PlotName": "plot1",
        "PlotTypeId": 1
      },
      "SoilTest": {
        "SoilLabId": 1,
        "SoilLabName": "Default",
        "SoilTestName": "farm1, test1",
        "ST_Date": "01/07/18",
        "ST_SoilType": 1,
        "ST_LayerDepth": 20,
        "R_LayerDepth": 20,
        "ST_CEC": 15,
        "ST_BulkDensity": 1.2,
        "ST_OM": Number(form3.organicMatter),
        "ST_EC_Val": 1,
        "ST_PH_Val": Number(form3.ph),
        "ST_AverageTemp": 20,
        "EM_N_Cbo": "1",
        "EM_P_Cbo": "1",
        "EM_K_Cbo": "1",
        "EM_Ca_Cbo": "1",
        "EM_Mg_Cbo": "1",
        "EM_S_Cbo": "1",
        "EM_B_Cbo": "1",
        "EM_Fe_Cbo": "1",
        "EM_Mn_Cbo": "1",
        "EM_Zn_Cbo": "1",
        "EM_Cu_Cbo": "1",
        "EM_Mo_Cbo": "1",
        "EM_Na_Cbo": "1",
        "EM_Al_Cbo": "1",
        "EM_Cl_Cbo": "1",
        "UnitId": 1,
        "N_Val": parseFloat(convertData[0]['changeNutrientForm']),
        "P_Val": parseFloat(convertData[1]['changeNutrientForm']),
        "K_Val": parseFloat(convertData[2]['changeNutrientForm']),
        "Ca_Val": parseFloat(convertData[3]['changeNutrientForm']),
        "Mg_Val": parseFloat(convertData[4]['changeNutrientForm']),
        "S_Val": parseFloat(convertData[5]['changeNutrientForm']),
        "B_Val": parseFloat(convertData[6]['changeNutrientForm']),
        "Fe_Val": parseFloat(convertData[7]['changeNutrientForm']),
        "Mn_Val": parseFloat(convertData[8]['changeNutrientForm']),
        "Zn_Val": parseFloat(convertData[9]['changeNutrientForm']),
        "Cu_Val": parseFloat(convertData[10]['changeNutrientForm']),
        "Mo_Val": parseFloat(convertData[11]['changeNutrientForm']),
        "Na_Val": parseFloat(convertData[12]['changeNutrientForm']),
        "Al_Val": parseFloat(convertData[13]['changeNutrientForm']),
        "Cl_Val": parseFloat(convertData[14]['changeNutrientForm'])
      },
      // "BaseDressing": {
      //   "CEC": "13",
      //   "SoilTypeId": 1,
      //   "N_percentage_val": 50,
      //   "P_percentage_val": 40,
      //   "K_percentage_val": 5,
      //   "Ca_percentage_val": null,
      //   "Mg_percentage_val": null,
      //   "S_percentage_val": null,
      //   "B_percentage_val": null,
      //   "Fe_percentage_val": null,
      //   "Mn_percentage_val": null,
      //   "Zn_percentage_val": null,
      //   "Cu_percentage_val": null,
      //   "Mo_percentage_val": null,
      //   "Na_percentage_val": "",
      //   "HCO3_percentage_val": "",
      //   "CO3_percentage_val": "",
      //   "SelectedFertilizers": {
      //     "Fertilizer": [
      //       {
      //         "Id": 13,
      //         "FertilizerId": 13
      //       },
      //       {
      //         "Id": 11,
      //         "FertilizerId": 11
      //       }
      //     ]
      //   }
      // }
      "Fertilizers": {
        "Fertilizer": [
          {
            "Id": 9,
            "FertilizerId": 9,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 15,
            "FertilizerId": 15,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 163,
            "FertilizerId": 163,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 26,
            "FertilizerId": 26,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 5400,
            "FertilizerId": 5400,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 23,
            "FertilizerId": 23,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 17,
            "FertilizerId": 17,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 164,
            "FertilizerId": 164,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 838,
            "FertilizerId": 838,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 4,
            "FertilizerId": 4,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 2,
            "FertilizerId": 2,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 3,
            "FertilizerId": 3,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 24,
            "FertilizerId": 24,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 4469,
            "FertilizerId": 4469,
            "ConcentrationUnit": 4,
            "AcidConcentration": "0"
          },
          {
            "Id": 4504,
            "FertilizerId": 4504,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 14,
            "FertilizerId": 14,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 4657,
            "FertilizerId": 4657,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 4552,
            "FertilizerId": 4552,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 4413,
            "FertilizerId": 4413,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 4551,
            "FertilizerId": 4551,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 12,
            "FertilizerId": 12,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 13,
            "FertilizerId": 13,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 4459,
            "FertilizerId": 4459,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 159,
            "FertilizerId": 159,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 11,
            "FertilizerId": 11,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 10,
            "FertilizerId": 10,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 6235,
            "FertilizerId": 6235,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 165,
            "FertilizerId": 165,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 8235,
            "FertilizerId": 8235,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 6234,
            "FertilizerId": 6234,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 25,
            "FertilizerId": 25,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 4490,
            "FertilizerId": 4490,
            "ConcentrationUnit": 4,
            "AcidConcentration": "0"
          },
          {
            "Id": 18,
            "FertilizerId": 18,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          },
          {
            "Id": 1,
            "FertilizerId": 1,
            "ConcentrationUnit": 1,
            "AcidConcentration": "0"
          }
        ]
      }
    })
    console.log(body)
    let headers = new HttpHeaders();
    headers = headers.set('content-Type', 'application/json;charset=utf-8');
    return Observable.create((observer) => {
      return this._http.post(Urls.recommandation, body, { headers: headers })
        .subscribe(data => {
          observer.next(data);
        },
          err => {
            console.error(err);
          });
    });
  }
}
