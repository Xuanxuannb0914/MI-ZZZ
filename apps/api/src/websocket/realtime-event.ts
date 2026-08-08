export interface RealtimeEventEnvelope<TData extends object> {
  readonly id: string;
  readonly type: string;
  readonly version: number;
  readonly occurredAt: string;
  readonly correlationId: string;
  readonly sequence?: number;
  readonly data: TData;
}
