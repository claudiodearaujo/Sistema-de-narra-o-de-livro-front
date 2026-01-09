import { Injectable } from '@angular/core';

// Declare gtag function for TypeScript
declare let gtag: Function;

/**
 * Analytics Service
 * Manages Google Analytics 4 event tracking
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  /**
   * Track a custom event
   * @param eventName Name of the event
   * @param eventParams Additional parameters for the event
   */
  trackEvent(eventName: string, eventParams: any = {}): void {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventParams);
    }
  }

  /**
   * Track page view
   * @param pageTitle Title of the page
   * @param pagePath Path of the page
   */
  trackPageView(pageTitle: string, pagePath: string): void {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: pageTitle,
        page_path: pagePath
      });
    }
  }

  // ========================================
  // BOOK EVENTS
  // ========================================

  /**
   * Track when user views book details
   */
  trackBookView(bookId: string, bookTitle: string): void {
    this.trackEvent('view_book', {
      book_id: bookId,
      book_title: bookTitle,
      content_type: 'book'
    });
  }

  /**
   * Track when user creates a book
   */
  trackBookCreate(bookId: string, bookTitle: string): void {
    this.trackEvent('create_book', {
      book_id: bookId,
      book_title: bookTitle,
      content_type: 'book'
    });
  }

  /**
   * Track when user edits a book
   */
  trackBookEdit(bookId: string, bookTitle: string): void {
    this.trackEvent('edit_book', {
      book_id: bookId,
      book_title: bookTitle,
      content_type: 'book'
    });
  }

  /**
   * Track when user deletes a book
   */
  trackBookDelete(bookId: string, bookTitle: string): void {
    this.trackEvent('delete_book', {
      book_id: bookId,
      book_title: bookTitle,
      content_type: 'book'
    });
  }

  // ========================================
  // CHAPTER EVENTS
  // ========================================

  /**
   * Track when user creates a chapter
   */
  trackChapterCreate(bookId: string, chapterId: string, chapterTitle: string): void {
    this.trackEvent('create_chapter', {
      book_id: bookId,
      chapter_id: chapterId,
      chapter_title: chapterTitle,
      content_type: 'chapter'
    });
  }

  /**
   * Track when user views a chapter
   */
  trackChapterView(bookId: string, chapterId: string, chapterTitle: string): void {
    this.trackEvent('view_chapter', {
      book_id: bookId,
      chapter_id: chapterId,
      chapter_title: chapterTitle,
      content_type: 'chapter'
    });
  }

  /**
   * Track when user edits a chapter
   */
  trackChapterEdit(bookId: string, chapterId: string, chapterTitle: string): void {
    this.trackEvent('edit_chapter', {
      book_id: bookId,
      chapter_id: chapterId,
      chapter_title: chapterTitle,
      content_type: 'chapter'
    });
  }

  // ========================================
  // CHARACTER EVENTS
  // ========================================

  /**
   * Track when user creates a character
   */
  trackCharacterCreate(bookId: string, characterId: string, characterName: string): void {
    this.trackEvent('create_character', {
      book_id: bookId,
      character_id: characterId,
      character_name: characterName,
      content_type: 'character'
    });
  }

  /**
   * Track when user views characters list
   */
  trackCharactersView(bookId: string): void {
    this.trackEvent('view_characters', {
      book_id: bookId,
      content_type: 'character_list'
    });
  }

  // ========================================
  // SPEECH EVENTS
  // ========================================

  /**
   * Track when user creates a speech/narration
   */
  trackSpeechCreate(bookId: string, chapterId: string, characterId: string): void {
    this.trackEvent('create_speech', {
      book_id: bookId,
      chapter_id: chapterId,
      character_id: characterId,
      content_type: 'speech'
    });
  }

  /**
   * Track when user plays a speech/narration
   */
  trackSpeechPlay(speechId: string, bookId?: string): void {
    this.trackEvent('play_speech', {
      speech_id: speechId,
      book_id: bookId,
      content_type: 'speech'
    });
  }

  /**
   * Track when user generates TTS for a speech
   */
  trackTTSGenerate(speechId: string, voiceId: string): void {
    this.trackEvent('generate_tts', {
      speech_id: speechId,
      voice_id: voiceId,
      content_type: 'tts'
    });
  }

  // ========================================
  // NAVIGATION EVENTS
  // ========================================

  /**
   * Track when user navigates to a specific section
   */
  trackNavigation(from: string, to: string, action: string): void {
    this.trackEvent('navigation', {
      from_page: from,
      to_page: to,
      action: action
    });
  }

  /**
   * Track when user clicks on quick action button
   */
  trackQuickAction(actionName: string, bookId?: string): void {
    this.trackEvent('quick_action', {
      action_name: actionName,
      book_id: bookId
    });
  }

  /**
   * Track when user switches tabs
   */
  trackTabSwitch(tabName: string, context: string): void {
    this.trackEvent('tab_switch', {
      tab_name: tabName,
      context: context
    });
  }

  // ========================================
  // SOCIAL EVENTS
  // ========================================

  /**
   * Track when user shares content
   */
  trackShare(contentType: string, contentId: string, shareMethod: string): void {
    this.trackEvent('share', {
      content_type: contentType,
      content_id: contentId,
      method: shareMethod
    });
  }

  /**
   * Track when user likes content
   */
  trackLike(contentType: string, contentId: string): void {
    this.trackEvent('like', {
      content_type: contentType,
      content_id: contentId
    });
  }

  /**
   * Track when user comments on content
   */
  trackComment(contentType: string, contentId: string): void {
    this.trackEvent('comment', {
      content_type: contentType,
      content_id: contentId
    });
  }

  /**
   * Track when user follows another user
   */
  trackFollow(userId: string): void {
    this.trackEvent('follow', {
      target_user_id: userId
    });
  }

  // ========================================
  // USER EVENTS
  // ========================================

  /**
   * Track user login
   */
  trackLogin(method: string): void {
    this.trackEvent('login', {
      method: method
    });
  }

  /**
   * Track user signup
   */
  trackSignUp(method: string): void {
    this.trackEvent('sign_up', {
      method: method
    });
  }

  /**
   * Track user logout
   */
  trackLogout(): void {
    this.trackEvent('logout', {});
  }

  // ========================================
  // ENGAGEMENT EVENTS
  // ========================================

  /**
   * Track time spent on page
   */
  trackTimeOnPage(pageTitle: string, timeInSeconds: number): void {
    this.trackEvent('time_on_page', {
      page_title: pageTitle,
      duration_seconds: timeInSeconds
    });
  }

  /**
   * Track when user searches
   */
  trackSearch(searchTerm: string, resultsCount: number): void {
    this.trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  /**
   * Track error events
   */
  trackError(errorType: string, errorMessage: string, context?: string): void {
    this.trackEvent('error', {
      error_type: errorType,
      error_message: errorMessage,
      context: context
    });
  }
}
