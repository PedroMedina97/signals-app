import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule,
  FormArray, 
  Validators, 
  ValidatorFn, 
  AbstractControl, 
  ValidationErrors 
} from '@angular/forms';
// Importar la implementación custom de Signal Forms
import { form, field, group, array, SignalFormGroup } from './signal-forms.utils';

// Interfaces para los datos del formulario
interface UserProfile {
  name: string;
  email: string;
  age: number;
  password: string;
  confirmPassword: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  skills: string[];
  acceptTerms: boolean;
}

interface ServerError {
  field: string;
  message: string;
}

@Component({
  selector: 'app-seccion8',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seccion8.html',
  styleUrl: './seccion8.scss',
})
export class Seccion8 {
  // Ejemplo 1: Formulario simple básico con Signal Forms
  simpleForm = form({
    username: field('', [Validators.required, Validators.minLength(3)]),
    email: field('', [Validators.required, Validators.email])
  });

  // Ejemplo 2-7: Formulario con validación avanzada usando Signal Forms
  userForm = form({
    name: field('', [
      Validators.required, 
      Validators.minLength(2),
      Validators.maxLength(50)
    ]),
    email: field('', [Validators.required, Validators.email]),
    age: field<number | null>(null, [
      Validators.required,
      Validators.min(18),
      Validators.max(100)
    ]),
    password: field('', [
      Validators.required,
      Validators.minLength(8),
      this.passwordStrengthValidator()
    ]),
    confirmPassword: field('', [Validators.required]),
    phone: field('', [this.phoneValidator()]),
    acceptTerms: field(false, [Validators.requiredTrue])
  }, { validators: [this.passwordMatchValidator(), this.agePhoneValidator()] });

  // Ejemplo 8-9: Formularios anidados con Signal Forms
  addressForm = group({
    street: field('', [Validators.required]),
    city: field('', [Validators.required]),
    zipCode: field('', [Validators.required, Validators.pattern(/^\d{5}$/)])
  });

  // Ejemplo 10-11: FormArray para listas dinámicas con Signal Forms
  skillsForm = form({
    skills: array([
      field('', [Validators.required, Validators.minLength(2)])
    ])
  });

  // Ejemplo 12: Formulario completo con todo integrado usando Signal Forms
  completeForm = form({
    personalInfo: group({
      name: field('', [Validators.required]),
      email: field('', [Validators.required, Validators.email]),
      age: field<number | null>(null, [Validators.required, Validators.min(18)])
    }),
    address: group({
      street: field('', [Validators.required]),
      city: field('', [Validators.required]),
      zipCode: field('', [Validators.required, Validators.pattern(/^\d{5}$/)])
    }),
    skills: array([]),
    notifications: field(true)
  });

  // Signals para el estado del formulario
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal<string | null>(null);
  serverErrors = signal<ServerError[]>([]);
  
  // Campos condicionales (aquí SÍ usamos signals para estado del componente)
  showPhoneField = signal(true);
  requirePhoneValidation = signal(false);
  
  // Computed signal que observa el valor del formulario usando Signal Forms API
  isAdult = computed(() => {
    // Con Signal Forms, accedemos directamente a los controles y usamos $value() como signal
    const age = this.userForm.controls.age.$value();
    return age !== null && age !== undefined && age >= 18;
  });

  // Validadores personalizados
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
      
      if (!valid) {
        return {
          passwordStrength: {
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecial
          }
        };
      }
      return null;
    };
  }

  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const phoneRegex = /^[0-9]{10}$/;
      const valid = phoneRegex.test(control.value);
      
      return valid ? null : { invalidPhone: { value: control.value } };
    };
  }

  // Validación cruzada: contraseñas deben coincidir (Signal Forms compatible)
  passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      // Acceder a controles directamente desde el grupo
      const controls = (group as any).controls;
      if (!controls) return null;
      
      const password = controls.password?.value;
      const confirmPassword = controls.confirmPassword?.value;
      
      if (!password || !confirmPassword) return null;
      
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  // Validación condicional: teléfono requerido si edad >= 65
  agePhoneValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const controls = (group as any).controls;
      if (!controls) return null;
      
      const age = controls.age?.value;
      const phone = controls.phone?.value;
      
      if (age && age >= 65 && !phone) {
        return { phoneRequiredForSeniors: true };
      }
      
      return null;
    };
  }

  // Métodos para FormArray - Con Signal Forms tenemos acceso directo
  get skills() {
    return this.skillsForm.controls.skills;
  }

  get completeSkills() {
    return this.completeForm.controls.skills;
  }

  addSkill(): void {
    // Con Signal Forms, field() crea controles con signals integrados
    this.skills.push(field('', [Validators.required, Validators.minLength(2)]));
  }

  removeSkill(index: number): void {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
    }
  }

  addCompleteSkill(): void {
    this.completeSkills.push(field('', [Validators.required]));
  }

  removeCompleteSkill(index: number): void {
    this.completeSkills.removeAt(index);
  }

  // Control condicional de campos
  togglePhoneField(): void {
    this.showPhoneField.update(v => !v);
  }

  togglePhoneValidation(): void {
    this.requirePhoneValidation.update(v => !v);
    // Con Signal Forms, acceso directo a controles
    const phoneControl = this.userForm.controls.phone;
    
    if (this.requirePhoneValidation()) {
      phoneControl.setValidators([Validators.required, this.phoneValidator()]);
    } else {
      phoneControl.setValidators([this.phoneValidator()]);
    }
    phoneControl.updateValueAndValidity();
  }

  // Deshabilitar campos condicionalmente
  disableEmailField(): void {
    this.userForm.controls.email.disable();
  }

  enableEmailField(): void {
    this.userForm.controls.email.enable();
  }

  // Métodos de envío
  onSimpleSubmit(): void {
    if (this.simpleForm.valid) {
      console.log('Formulario simple válido:', this.simpleForm.value);
      alert('Formulario simple enviado correctamente');
      this.simpleForm.reset();
    } else {
      this.markFormGroupTouched(this.simpleForm);
    }
  }

  onUserFormSubmit(): void {
    if (this.userForm.valid) {
      console.log('Formulario de usuario válido:', this.userForm.value);
      alert('Formulario de usuario enviado correctamente');
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  async onCompleteFormSubmit(): Promise<void> {
    if (this.completeForm.invalid) {
      this.markFormGroupTouched(this.completeForm);
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.submitSuccess.set(false);
    this.serverErrors.set([]);

    try {
      // Simular llamada al servidor
      await this.submitToServer(this.completeForm.value);
      
      this.submitSuccess.set(true);
      this.completeForm.reset();
      
      setTimeout(() => {
        this.submitSuccess.set(false);
      }, 3000);
    } catch (error: any) {
      this.submitError.set(error.message || 'Error al enviar el formulario');
      
      // Simular errores del servidor
      if (error.fieldErrors) {
        this.serverErrors.set(error.fieldErrors);
        this.applyServerErrors(error.fieldErrors);
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Simular envío al servidor
  private submitToServer(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular validación del servidor (50% de probabilidad de error)
        if (Math.random() > 0.5) {
          resolve({ success: true, message: 'Datos guardados correctamente' });
        } else {
          reject({
            message: 'Error de validación del servidor',
            fieldErrors: [
              { field: 'email', message: 'Este email ya está registrado' },
              { field: 'name', message: 'El nombre contiene caracteres no permitidos' }
            ]
          });
        }
      }, 2000);
    });
  }

  // Aplicar errores del servidor a los campos
  private applyServerErrors(errors: ServerError[]): void {
    errors.forEach(error => {
      // Navegar por la estructura de controles anidados usando Signal Forms
      const path = error.field.split('.');
      let control: any = this.completeForm;
      
      for (const key of path) {
        control = control.controls?.[key];
        if (!control) break;
      }
      
      if (control) {
        control.setErrors({ serverError: error.message });
      }
    });
  }

  // Marcar todos los campos como touched para mostrar errores
  private markFormGroupTouched(formGroup: any): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      
      control?.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Métodos auxiliares para el template - Compatible con Signal Forms
  getFieldError(formGroup: SignalFormGroup<any>, fieldName: string): string | null {
    const field = formGroup.controls[fieldName];
    
    if (!field || !field.errors || !field.touched) {
      return null;
    }

    const errors = field.errors;
    
    if (errors['required']) return 'Este campo es requerido';
    if (errors['email']) return 'Email inválido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['min']) return `Valor mínimo: ${errors['min'].min}`;
    if (errors['max']) return `Valor máximo: ${errors['max'].max}`;
    if (errors['pattern']) return 'Formato inválido';
    if (errors['invalidPhone']) return 'Teléfono inválido (10 dígitos)';
    if (errors['serverError']) return errors['serverError'];
    
    if (errors['passwordStrength']) {
      const strength = errors['passwordStrength'];
      const missing = [];
      if (!strength.hasUpperCase) missing.push('mayúscula');
      if (!strength.hasLowerCase) missing.push('minúscula');
      if (!strength.hasNumber) missing.push('número');
      if (!strength.hasSpecial) missing.push('carácter especial');
      return `Falta: ${missing.join(', ')}`;
    }
    
    return 'Error de validación';
  }

  getFormError(formGroup: SignalFormGroup<any>): string | null {
    // Con SignalFormGroup, $errors() devuelve los errores
    const errors = formGroup.$errors();
    if (!errors) return null;
    
    if (errors['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }
    
    if (errors['phoneRequiredForSeniors']) {
      return 'El teléfono es requerido para personas mayores de 65 años';
    }
    
    return null;
  }

  isFieldInvalid(formGroup: SignalFormGroup<any>, fieldName: string): boolean {
    const field = formGroup.controls[fieldName];
    return !!(field && field.invalid && field.touched);
  }

  isFieldValid(formGroup: SignalFormGroup<any>, fieldName: string): boolean {
    const field = formGroup.controls[fieldName];
    return !!(field && field.valid && field.touched);
  }

  resetAllForms(): void {
    this.simpleForm.reset();
    this.userForm.reset();
    this.addressForm.reset();
    this.skillsForm.reset();
    this.completeForm.reset();
    this.submitSuccess.set(false);
    this.submitError.set(null);
    this.serverErrors.set([]);
  }
}
