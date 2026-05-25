import { 
  FormControl, 
  FormGroup, 
  FormArray, 
  ValidatorFn, 
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { signal, computed, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * SignalFormControl - FormControl con signals integrados
 */
export class SignalFormControl<T = any> extends FormControl {
  // Signal que refleja el valor actual del control
  readonly valueSignal: Signal<T | null | undefined>;
  
  // Signals computados para estados comunes
  readonly validSignal: Signal<boolean>;
  readonly invalidSignal: Signal<boolean>;
  readonly pendingSignal: Signal<boolean>;
  readonly touchedSignal = signal(false);
  readonly dirtySignal = signal(false);
  
  private readonly statusSignal: Signal<string>;

  constructor(
    value: any = null,
    validators?: ValidatorFn | ValidatorFn[] | null
  ) {
    super(value, validators || undefined);
    
    // Convertir valueChanges observable a signal
    this.valueSignal = toSignal(this.valueChanges, { 
      initialValue: this.value 
    });
    
    // Convertir statusChanges observable a signal
    this.statusSignal = toSignal(this.statusChanges, { 
      initialValue: this.status 
    });
    
    // Computed signals para estados
    this.validSignal = computed(() => this.statusSignal() === 'VALID');
    this.invalidSignal = computed(() => this.statusSignal() === 'INVALID');
    this.pendingSignal = computed(() => this.statusSignal() === 'PENDING');
    
    // Sincronizar touched y dirty con signals
    this.statusChanges.subscribe(() => {
      this.touchedSignal.set(this.touched);
      this.dirtySignal.set(this.dirty);
    });
  }
  
  // Getter para acceder al signal de manera más natural
  $value(): T | null | undefined {
    return this.valueSignal();
  }
  
  $isValid(): boolean {
    return this.validSignal();
  }
  
  $isInvalid(): boolean {
    return this.invalidSignal();
  }
}

/**
 * SignalFormGroup - FormGroup con signals integrados
 */
export class SignalFormGroup<T extends { [K in keyof T]: AbstractControl<any> }> extends FormGroup<T> {
  readonly valueSignal: Signal<any>;
  readonly statusSignal: Signal<string>;
  readonly validSignal: Signal<boolean>;
  readonly invalidSignal: Signal<boolean>;
  readonly pendingSignal: Signal<boolean>;

  constructor(
    controls: T,
    validators?: ValidatorFn | ValidatorFn[] | null
  ) {
    super(controls, validators ? { validators } : undefined);
    
    this.valueSignal = toSignal(this.valueChanges, { 
      initialValue: this.value 
    });
    
    this.statusSignal = toSignal(this.statusChanges, { 
      initialValue: this.status 
    });
    
    this.validSignal = computed(() => this.statusSignal() === 'VALID');
    this.invalidSignal = computed(() => this.statusSignal() === 'INVALID');
    this.pendingSignal = computed(() => this.statusSignal() === 'PENDING');
  }
  
  // Getters para acceder a signals de manera natural
  $value(): any {
    return this.valueSignal();
  }
  
  $isValid(): boolean {
    return this.validSignal();
  }
  
  $isInvalid(): boolean {
    return this.invalidSignal();
  }
  
  $errors(): ValidationErrors | null {
    return this.errors;
  }
}

/**
 * SignalFormArray - FormArray con signals integrados
 */
export class SignalFormArray<T = any> extends FormArray<any> {
  readonly valueSignal: Signal<T[]>;
  readonly statusSignal: Signal<string>;
  readonly lengthSignal = signal(0);
  readonly validSignal: Signal<boolean>;
  readonly invalidSignal: Signal<boolean>;

  constructor(
    controls: AbstractControl[],
    validators?: ValidatorFn | ValidatorFn[] | null
  ) {
    super(controls, validators || undefined);
    
    this.valueSignal = toSignal(this.valueChanges, { 
      initialValue: this.value 
    });
    
    this.statusSignal = toSignal(this.statusChanges, { 
      initialValue: this.status 
    });
    
    this.validSignal = computed(() => this.statusSignal() === 'VALID');
    this.invalidSignal = computed(() => this.statusSignal() === 'INVALID');
    
    this.lengthSignal.set(this.length);
  }
  
  override push(control: AbstractControl): void {
    super.push(control);
    this.lengthSignal.set(this.length);
  }
  
  override removeAt(index: number): void {
    super.removeAt(index);
    this.lengthSignal.set(this.length);
  }
  
  override clear(): void {
    super.clear();
    this.lengthSignal.set(0);
  }
  
  $value(): T[] {
    return this.valueSignal();
  }
  
  $isValid(): boolean {
    return this.validSignal();
  }
}

/**
 * API ESTILO SIGNAL FORMS
 * ========================
 * Funciones helper que simulan la futura API oficial
 */

/**
 * field() - Crea un SignalFormControl
 * Simula la futura API: field(initialValue, validators)
 */
export function field<T = any>(
  initialValue: T,
  validators?: ValidatorFn | ValidatorFn[]
): SignalFormControl<T> {
  return new SignalFormControl<T>(initialValue, validators);
}

/**
 * group() - Crea un SignalFormGroup
 * Simula la futura API: group({ field1: field(...), field2: field(...) })
 */
export function group<T extends { [K in keyof T]: AbstractControl<any> }>(
  controls: T,
  validators?: ValidatorFn | ValidatorFn[]
): SignalFormGroup<T> {
  return new SignalFormGroup<T>(controls, validators);
}

/**
 * array() - Crea un SignalFormArray
 * Simula la futura API: array([field(...), field(...)])
 */
export function array<T = any>(
  controls: AbstractControl[] = [],
  validators?: ValidatorFn | ValidatorFn[]
): SignalFormArray<T> {
  return new SignalFormArray<T>(controls, validators);
}

/**
 * form() - Alias de group() para el formulario raíz
 * Simula la futura API: form({ ... })
 */
export function form<T extends { [K in keyof T]: AbstractControl<any> }>(
  controls: T,
  options?: { validators?: ValidatorFn | ValidatorFn[] }
): SignalFormGroup<T> {
  return new SignalFormGroup<T>(controls, options?.validators);
}
