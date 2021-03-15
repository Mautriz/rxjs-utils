import { BehaviorSubject } from 'rxjs';
import produce from 'immer';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';

import { customReplay } from './customReplay';

type StateSubjectOptions = { storage: Storage; storageKey: string };
/**
 * State subject
 */
export class StateSubject<T> extends BehaviorSubject<T> {
	private initialState: T;
	opts: StateSubjectOptions;

	constructor(item: T, opts: StateSubjectOptions = { storage: localStorage, storageKey: null }) {
		super(opts.storageKey ? JSON.parse(opts.storage.getItem(opts.storageKey)) || item : item);
		this.opts = opts;
		this.initialState = item;
	}

	next(nextValue: T) {
		super.next(nextValue);
		if (this.opts?.storageKey) this.opts.storage.setItem(this.opts.storageKey, JSON.stringify(nextValue));
	}

	update(changeFun: (draft: T) => void): T {
		this.next(produce(this.getValue(), changeFun));
		return this.getValue();
	}
	select<R>(selectFn: (value: T, index: number) => R): Observable<R> {
		return this.pipe(map(selectFn), distinctUntilChanged(), customReplay());
	}

	selectF<R>(selectFn: (value: T, index: number) => R, filterFn: (value: T) => boolean = (v) => !!v): Observable<R> {
		return this.pipe(filter(filterFn), map(selectFn), distinctUntilChanged(), customReplay());
	}

	get<R>(selectFn: (value: T) => R) {
		return selectFn(this.getValue());
	}

	reset() {
		this.next(this.initialState);
	}
}
