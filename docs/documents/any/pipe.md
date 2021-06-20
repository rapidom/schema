# Pipe

Pass in your custom validator

```typescript
import Schema, { NumberType } from "@rapidom/schema";

funcrtion isFinite(this: NumberType, value: number): number {
  if (Number.isFinite(value)) return value;
  
  this.fail("Expected to be a finite number");
}

const validator = Schema.number().pipe(isFinite);
```

