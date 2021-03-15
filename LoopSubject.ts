import { BehaviorSubject } from 'rxjs';

export class LoopSubject<T> extends BehaviorSubject<T> {
	private _toLoopValues: T[];
	private currentIdx: number;

	constructor(toLoopValues: T[] = [], startingValue = toLoopValues[0]) {
		super(startingValue);
		this._toLoopValues = toLoopValues;
		this.currentIdx = 0;
	}

	nextValue() {
		this.next(this._toLoopValues[this.currentIdx + 1] ?? this._toLoopValues[0]);
		this.currentIdx = this._toLoopValues[this.currentIdx + 1] ? this.currentIdx + 1 : 0;
	}

	updateLoopValues(newToLoopValues: T[], newDefaultValue?: T) {
		this._toLoopValues = newToLoopValues;
		let newIdx = newToLoopValues.findIndex((e) => e === newDefaultValue || e === this.getValue());
		if (newIdx < 0) newIdx = 0;
		this.currentIdx = newIdx;
		this.next(newToLoopValues[newIdx]);
	}
}
