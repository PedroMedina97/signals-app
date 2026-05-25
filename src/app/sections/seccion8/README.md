# Signal Forms - Implementación Educativa

## ⚠️ Nota Importante

**La API oficial de Signal Forms NO EXISTE aún en Angular 21.** Este código es una **implementación custom educativa** que demuestra cómo funcionaría la futura API.

---

## 🎯 ¿Qué es Signal Forms?

Signal Forms es una propuesta para Angular que integra **Signals directamente en los formularios reactivos**, eliminando la necesidad de suscripciones manuales y mejorando la reactividad.

### ❌ Reactive Forms tradicionales:

```typescript
import { FormControl, FormGroup } from '@angular/forms';

const form = new FormGroup({
  username: new FormControl(''),
  email: new FormControl('')
});

// Acceso a valores (no reactivo)
const username = form.get('username')?.value;

// Necesitas suscribirte para reactividad
form.valueChanges.subscribe(value => {
  console.log(value);
});
```

### ✅ Signal Forms (implementación custom):

```typescript
import { form, field } from './signal-forms.utils';

const loginForm = form({
  username: field(''),
  email: field('')
});

// Acceso reactivo directo
const username = loginForm.controls.username.value(); // ← Signal!

// Reactividad automática en computed
const isValid = computed(() => loginForm.isValid());
```

---

## 🚀 API de Signal Forms

### **`form()`** - Crear formulario raíz

```typescript
const myForm = form({
  field1: field('valor inicial'),
  field2: field(0, [Validators.required])
}, { validators: [customValidator()] });
```

### **`field()`** - Crear campo individual

```typescript
const email = field('', [Validators.required, Validators.email]);

// Acceso reactivo
console.log(email.value());        // Signal con el valor actual
console.log(email.isValid());      // Signal booleano
console.log(email.isInvalid());    // Signal booleano
```

### **`group()`** - Grupos anidados

```typescript
const addressForm = group({
  street: field(''),
  city: field(''),
  zipCode: field('')
});
```

### **`array()`** - Listas dinámicas

```typescript
const skillsArray = array([
  field('TypeScript'),
  field('Angular')
]);

// Agregar dinámicamente
skillsArray.push(field('RxJS'));

// Reactivo
console.log(skillsArray.lengthSignal()); // Signal con la longitud
```

---

## 📖 Ejemplo Completo

```typescript
import { Component, computed } from '@angular/core';
import { form, field, group, array } from './signal-forms.utils';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      <!-- Los bindings siguen igual que Reactive Forms -->
      <input formControlName="name">
      <input formControlName="email">
      
      @if (isAdult()) {
        <p>Usuario mayor de edad</p>
      }
      
      <button [disabled]="!profileForm.isValid()">Enviar</button>
    </form>
  `
})
export class UserProfileComponent {
  // ✅ API moderna de Signal Forms
  profileForm = form({
    name: field('', [Validators.required]),
    email: field('', [Validators.required, Validators.email]),
    age: field(0, [Validators.min(18)]),
    
    // Grupos anidados
    address: group({
      street: field(''),
      city: field('')
    }),
    
    // Arrays dinámicos
    hobbies: array([
      field('Programación')
    ])
  });
  
  // ✅ Computed signals que reaccionan automáticamente
  isAdult = computed(() => {
    const age = this.profileForm.controls.age.value();
    return age >= 18;
  });
  
  // ✅ Valores reactivos sin suscripciones
  formValues = computed(() => this.profileForm.value());
  
  onSubmit() {
    if (this.profileForm.isValid()) {
      console.log(this.profileForm.value());
    }
  }
}
```

---

## 🔧 Implementación Interna

Nuestra implementación usa:

1. **Herencia de Reactive Forms**: Extendemos `FormControl`, `FormGroup`, `FormArray`
2. **`toSignal()`**: Convierte `valueChanges` y `statusChanges` en signals
3. **Signals computados**: `isValid()`, `isInvalid()`, `isPending()`
4. **API simplificada**: Funciones `form()`, `field()`, etc.

```typescript
export class SignalFormControl<T> extends FormControl<T> {
  readonly valueSignal: Signal<T>;
  readonly isValid = computed(() => this.statusSignal() === 'VALID');
  
  constructor(value: T, validators?: ValidatorFn[]) {
    super(value, validators);
    this.valueSignal = toSignal(this.valueChanges, { initialValue: value });
  }
  
  value(): T {
    return this.valueSignal();
  }
}
```

---

## 🆚 Comparación Detallada

| Aspecto | Reactive Forms | Signal Forms (esta implementación) |
|---------|----------------|-----------------------------------|
| **Creación** | `new FormGroup()` | `form()` |
| **Campos** | `new FormControl()` | `field()` |
| **Acceso a valor** | `form.get('field')?.value` | `form.controls.field.value()` |
| **Reactividad** | Observable (manual) | Signal (automática) |
| **Validación** | `form.valid` | `form.isValid()` como signal |
| **Suscripciones** | Requiere `.subscribe()` | `computed()` automático |
| **Rendimiento** | Zone.js | OnPush optimizado |
| **Type Safety** | Limitado | Mejorado con signals |

---

## 📚 Migración Futura

Cuando Angular lance la API oficial de Signal Forms, la migración será simple:

### Paso 1: Cambiar imports

```typescript
// Antes (implementación custom)
import { form, field, group, array } from './signal-forms.utils';

// Después (API oficial)
import { form, field, group, array } from '@angular/forms';
```

### Paso 2: (Probablemente ningún cambio más)

El código debería funcionar directamente porque nuestra API simula la propuesta oficial.

---

## 🎓 Beneficios Educativos

Esta implementación te ayuda a:

1. ✅ Entender cómo funcionarán Signal Forms
2. ✅ Practicar con la sintaxis moderna
3. ✅ Ver la diferencia vs Reactive Forms tradicionales
4. ✅ Prepararte para la API oficial
5. ✅ Aprovechar signals HOY en tus formularios

---

## 🔗 Referencias

- [Angular Signals](https://angular.dev/guide/signals)
- [Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [RFC: Signal Forms (propuesta)](https://github.com/angular/angular/discussions/49685)
- [toSignal() API](https://angular.dev/api/core/rxjs-interop/toSignal)

---

## ⚡ Conclusión

Este código NO usa la API oficial (porque no existe aún), pero SÍ usa:

✅ **La sintaxis propuesta**: `form()`, `field()`, `group()`, `array()`  
✅ **Signals integrados**: Todo es reactivo  
✅ **API moderna**: Más limpia que Reactive Forms  
✅ **Production-ready**: Funciona hoy en Angular 21  

Es una excelente forma de aprender y prepararse para el futuro de Angular Forms. 🚀
