import { Subjects, Publisher, ExpirationCompleteEvent } from '@chinasystems/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
