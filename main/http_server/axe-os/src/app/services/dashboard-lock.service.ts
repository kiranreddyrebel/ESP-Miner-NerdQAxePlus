import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

/**
 * Front-end password gate for the dashboard.
 *
 * Only a salted SHA-256 hash of the password is kept in the source, never the
 * plain text. To change the password, replace PASSWORD_HASH with the output of:
 *   echo -n "donreddy-gate:<new-password>" | sha256sum
 *
 * NOTE: this protects the UI only. The miner's /api endpoints are not affected.
 */
const SALT = 'password:';
const PASSWORD_HASH = '09de5273a534eee454a37c692c16c97b2447e01132f84651a52996c23939d5f1';
const STORAGE_KEY = 'dr_gate_token';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000;

@Injectable({
  providedIn: 'root'
})
export class DashboardLockService {

  /** Template-friendly flag: true while the real dashboard may be shown. */
  public unlocked = false;

  private failedAttempts = 0;
  private blockedUntil = 0;

  constructor() {
    this.unlocked = this.hasValidStoredToken();
  }

  /** Seconds the user still has to wait after too many wrong attempts (0 = none). */
  public get waitSeconds(): number {
    const left = this.blockedUntil - Date.now();
    return left > 0 ? Math.ceil(left / 1000) : 0;
  }

  /**
   * Try to unlock with the given password.
   * The unlock is remembered on this browser, so the password is only asked once
   * (until the user presses the lock button or clears browser data).
   */
  public unlock(password: string): boolean {
    if (this.waitSeconds > 0) {
      return false;
    }

    const candidate = CryptoJS.SHA256(SALT + (password ?? '')).toString();
    if (candidate !== PASSWORD_HASH) {
      this.failedAttempts++;
      if (this.failedAttempts >= MAX_ATTEMPTS) {
        this.failedAttempts = 0;
        this.blockedUntil = Date.now() + LOCKOUT_MS;
      }
      return false;
    }

    this.failedAttempts = 0;
    this.blockedUntil = 0;
    this.unlocked = true;
    this.storeToken();
    return true;
  }

  /** Lock the dashboard again and forget any stored session. */
  public lock(): void {
    this.unlocked = false;
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }

  // --- helpers ---

  private token(): string {
    return CryptoJS.SHA256(PASSWORD_HASH + ':session').toString();
  }

  private storeToken(): void {
    try {
      localStorage.setItem(STORAGE_KEY, this.token());
    } catch {
      // Storage unavailable (private mode etc.): stay unlocked for this page load only.
    }
  }

  private hasValidStoredToken(): boolean {
    try {
      const expected = this.token();
      return sessionStorage.getItem(STORAGE_KEY) === expected
        || localStorage.getItem(STORAGE_KEY) === expected;
    } catch {
      return false;
    }
  }
}
