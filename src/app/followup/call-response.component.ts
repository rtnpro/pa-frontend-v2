import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { routeConstants, statusType, connectionProperties, callResponse } from '../shared/app-properties';
import { Devotee } from '../model/devotee.model';
import { HttpService } from "../shared/http.service";
import { LoginSessionService } from '../login/login-session.service';

import { Followup } from '../model/followup.model';
import { History } from '../model/history.model';
import { StatusService } from '../shared/status.service';

@Component ({
    selector: 'call-response',
    templateUrl: './call-response.component.html',
})

export class CallResponseComponent implements OnInit {
    devotee: Devotee;
    followup: Followup;
    callResponse;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private httpService: HttpService,
        private loginSession: LoginSessionService, 
        private statusService: StatusService,
    ) {};

    ngOnInit() {
        this.callResponse = callResponse;
        this.devotee = new Devotee;
        this.followup = new Followup;
        this.followup.rating = 0;
        this.followup.volunteerId = this.loginSession.devoteeId;

        this.followup.response = callResponse.callAgain;

        this.activatedRoute.params.subscribe((params: Params) => {
            this.followup.attendeeId = +params[routeConstants.paramDevoteeId];
            this.followup.programId = +params[routeConstants.paramsProgramId];

            this.httpService.getData(connectionProperties.devotees, "/" + this.followup.attendeeId)
            .subscribe(devotee => {
                this.devotee = new Devotee;
                this.devotee = devotee as Devotee;
                
                this.httpService.getData(connectionProperties.getSpecificFollowupRecord,
                    '/' + this.followup.programId +
                    '/' + this.followup.attendeeId + 
                    '/' + this.followup.volunteerId
                ).subscribe(followupRecord => {
                    console.log(followupRecord);
                    this.followup = followupRecord as Followup;
                }, err => {
                    this.statusService.error("No Followup Record");
                    //Since followup record is not there create new record
                    //We have to find a better way to identify whether
                    //to create a new record
                    //This call may fail for technical resons too
                    this.followup.rating = 0;
                    this.followup.timestamp = Date.now();
                    this.httpService.postAndReturnData(connectionProperties.createFollowupRecord, '', this.followup)
                    .subscribe(follwup => {
                        //created a new followup record
                        this.followup = follwup as Followup;
                    }, err => {
                        //handle error of creating new followup record
                    });
                });
            }, err => {
                //Route to a different Page
            });
        });
    }

    onSaveClick() {
        // if(this.followup.rating == 0) {
        //     this.statusService.setFlag("Kindly rate the devotee!", statusType.error);
        //     return;
        // }
        this.followup.timestamp = Date.now();
        //Update History too
        let history = new History();
        history.comment = "[Followed up for " + this.followup.programName  + ", Responded as:" + this.followup.response+ "] " + this.followup.comment;
        history.commentedByDevoteeId = this.followup.volunteerId;
        history.ratedDevoteeId = this.followup.attendeeId;
        history.rating = this.followup.rating;
        history.response = this.followup.response;
        history.timeStamp = this.followup.timestamp;
        this.httpService.putAndReturnData(connectionProperties.updateFollowupRecord + '/' + this.followup.id, '', this.followup)
        .subscribe(follwup => {
            //created a new followup record
        }, err => {
            //handle error of creating new followup record
        });
        this.httpService.postAndReturnData(connectionProperties.writeHistory, '', history)
        .subscribe(history => {
            //Check the object if needed
        }, err => {
            this.statusService.error("Error updating history");
        });

        //Go Back
        this.onBackClick();
    }

    onBackClick() {
        let programId: number;
        this.activatedRoute.params.subscribe(params => {
            programId = +params[routeConstants.paramsProgramId];
            if(this.router.routerState.snapshot.url.startsWith(routeConstants.followup,1)) {
                this.router.navigate(['../../../', routeConstants.followupProgram, programId], {relativeTo: this.activatedRoute, queryParams: {id: this.devotee.id} });    
            }    
        });
    }
}