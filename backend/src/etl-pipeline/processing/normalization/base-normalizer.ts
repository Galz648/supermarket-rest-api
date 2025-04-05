import {
    UniformProduct,
    UniformPromo,
    UniformProductSchema,
    UniformPromoSchema,
    NormalizationFunctions
} from './uniform-format.js';

export interface BaseNormalizer<T> {
    normalize(product: T): UniformProduct;
    normalizePromo(promo: T): UniformPromo;
    validate(product: UniformProduct): boolean;
    validatePromo(promo: UniformPromo): boolean;
}

export abstract class AbstractNormalizer<T> implements BaseNormalizer<T> {
    abstract normalize(product: T): UniformProduct;
    abstract normalizePromo(promo: T): UniformPromo;

    validate(product: UniformProduct): boolean {
        try {
            UniformProductSchema.parse(product);
            return true;
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    }

    validatePromo(promo: UniformPromo): boolean {
        try {
            UniformPromoSchema.parse(promo);
            return true;
        } catch (error) {
            console.error('Promo validation error:', error);
            return false;
        }
    }

    protected normalizeDate(dateStr: string): string {
        return NormalizationFunctions.normalizeDate(dateStr);
    }

    protected normalizePrice(price: string | number): number {
        return NormalizationFunctions.normalizePrice(price);
    }

    protected normalizeUnitOfMeasure(unit: string): string {
        return NormalizationFunctions.normalizeUnitOfMeasure(unit);
    }

    protected normalizeManufacturer(manufacturer: string): string {
        return NormalizationFunctions.normalizeManufacturer(manufacturer);
    }

    protected normalizeCity(cityCode: string): string {
        return NormalizationFunctions.normalizeCity(cityCode);
    }
} 
