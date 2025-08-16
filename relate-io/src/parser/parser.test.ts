import { describe, it, expect } from 'vitest';
import { parse } from './parser';

describe('ER Diagram Parser', () => {
  it('should parse the title of the diagram', () => {
    const input = 'title My Awesome Diagram';
    const result = parse(input);
    expect(result.title).toBe('My Awesome Diagram');
  });

  it('should parse the notation of the diagram', () => {
    const input = 'notation crows-foot';
    const result = parse(input);
    expect(result.notation).toBe('crows-foot');
  });

  it('should parse a simple entity with its name', () => {
    const input = `
      user {
      }
    `;
    const result = parse(input);
    expect(result.entities.user).toBeDefined();
    expect(result.entities.user.name).toBe('user');
  });

  it('should parse an entity with attributes', () => {
    const input = `
      product {
        id string pk
        name string
        price number
      }
    `;
    const result = parse(input);
    const product = result.entities.product;
    expect(product).toBeDefined();
    expect(Object.keys(product.attributes).length).toBe(3);
    expect(product.attributes.id.type).toBe('string');
    expect(product.attributes.id.isPk).toBe(true);
    expect(product.attributes.name.type).toBe('string');
  });

  it('should parse an entity with metadata like icon and color', () => {
    const input = 'user [icon: user, color: blue] {}';
    const result = parse(input);
    const user = result.entities.user;
    expect(user).toBeDefined();
    expect(user.icon).toBe('user');
    expect(user.color).toBe('blue');
  });

  it('should parse relationships between entities', () => {
    const input = `
      user.id > order.user_id
      product.id <> order_item.product_id
    `;
    const result = parse(input);
    expect(result.relationships.length).toBe(2);
    expect(result.relationships[0].fromEntity).toBe('user');
    expect(result.relationships[0].toEntity).toBe('order');
    expect(result.relationships[0].type).toBe('one-to-many');
    expect(result.relationships[1].type).toBe('many-to-many');
  });

  it('should handle a full, complex example', () => {
    const input = `
      title E-commerce Schema
      notation chen

      user [icon: user] {
        id string pk
        email string unique
      }

      product {
        id string pk
        name string
        description text
      }

      user.id > product.seller_id
    `;
    const result = parse(input);
    expect(result.title).toBe('E-commerce Schema');
    expect(result.notation).toBe('chen');
    expect(result.entities.user).toBeDefined();
    expect(result.entities.product).toBeDefined();
    expect(result.relationships.length).toBe(1);
    expect(result.relationships[0].fromEntity).toBe('user');
  });
});
