import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import * as fromI18n from './@i18n/reducers';
import { DashboardLockService } from './services/dashboard-lock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'axe-os';

  // Password gate state
  public gateError = false;
  public gateWait = 0;
  private gateTimer?: ReturnType<typeof setInterval>;

  constructor(
    private translate: TranslateService,
    private store: Store<fromI18n.State>,
    public lock: DashboardLockService
  ) {
    // Set available languages
    translate.addLangs(['en', 'fr', 'es', 'de', 'it', 'ro', 'pl', 'da', 'zh-CN']);

    translate.setDefaultLang('en');

    // Store holds the active language (initialized from localStorage or 'en').
    // Subscribing here covers both initial load and user-triggered changes.
    this.store.select(fromI18n.selectLanguage).subscribe(language => {
      translate.use(language);
      localStorage.setItem('language', language);
    });
  }

  public submitGate(password: string): void {
    if (this.lock.unlock(password)) {
      this.gateError = false;
      this.gateWait = 0;
      return;
    }

    this.gateError = true;
    this.startWaitCountdown();
  }

  private startWaitCountdown(): void {
    this.gateWait = this.lock.waitSeconds;
    if (this.gateWait <= 0 || this.gateTimer) {
      return;
    }
    this.gateTimer = setInterval(() => {
      this.gateWait = this.lock.waitSeconds;
      if (this.gateWait <= 0 && this.gateTimer) {
        clearInterval(this.gateTimer);
        this.gateTimer = undefined;
      }
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.gateTimer) {
      clearInterval(this.gateTimer);
    }
  }
}
