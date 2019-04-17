import {FocusMonitor, FocusOrigin} from '@angular/cdk/a11y';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';

/** @title Monitoring focus with FocusMonitor */
@Component({
  selector: 'focus-monitor-overview-example',
  templateUrl: 'focus-monitor-overview-example.html',
  styleUrls: ['focus-monitor-overview-example.css']
})
export class FocusMonitorOverviewExample implements OnDestroy, AfterViewInit {

  @ViewChild('myInput') myInput: ElementRef;

  @ViewChild('element') element: ElementRef<HTMLElement>;
  @ViewChild('subtree') subtree: ElementRef<HTMLElement>;

  elementOrigin = this.formatOrigin(null);
  subtreeOrigin = this.formatOrigin(null);

  constructor(private focusMonitor: FocusMonitor,
              private cdr: ChangeDetectorRef,
              private ngZone: NgZone,
              private elRef: ElementRef) {
              }

  ngAfterViewInit() {
    this.focusMonitor.monitor(this.element)
        .subscribe(origin => this.ngZone.run(() => {
          this.elementOrigin = this.formatOrigin(origin);
          this.cdr.markForCheck();
        }));
    this.focusMonitor.monitor(this.subtree, true)
        .subscribe(origin => this.ngZone.run(() => {
          this.subtreeOrigin = this.formatOrigin(origin);
          this.cdr.markForCheck();
        }));
    this.focusMonitor.monitor(this.myInput)
      .subscribe(origion  => {
        console.log("focused");
        this.cdr.markForCheck();
      });
    this.focusMonitor.monitor(this.elRef)
      .subscribe(origin => {
        console.log('focused via mama');
        this.cdr.markForCheck();
      })
    setTimeout(() => {
      this.focusSome();
      console.log('timeout');
    }, 3000);
  }

  ngOnDestroy() {
    this.focusMonitor.stopMonitoring(this.element);
    this.focusMonitor.stopMonitoring(this.subtree);
  }

  formatOrigin(origin: FocusOrigin): string {
    return origin ? origin + ' focused' : 'blurred';
  }

  focusSome() {
    this.myInput.nativeElement.focus();
  }
}


/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */