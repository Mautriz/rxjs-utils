# rxjs-utils

Simple custom subjects to use in future projects

### StateSubject

Immutable subject, every update made to the subject is immutable (using immerjs)
Can be synced with a storage by passing it in the constructor (ex: localStorage, sessionStorage)
Memoized selector with .select()

### LoopSubject

Subject that takes an array and loops through it on nextValue() call
