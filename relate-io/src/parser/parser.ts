export interface Attribute {
  name: string;
  type: string;
  isPk: boolean;
  isFk: boolean;
  isUnique: boolean;
  isIndex: boolean;
}

export interface Entity {
  name: string;
  icon?: string;
  color?: string;
  attributes: Record<string, Attribute>;
}

export interface Relationship {
  fromEntity: string;
  fromAttribute: string;
  toEntity: string;
  toAttribute: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
}

export interface ParsedER {
  title?: string;
  notation?: 'chen' | 'crows-foot';
  entities: Record<string, Entity>;
  relationships: Relationship[];
}

// A simple regex-based parser. For a real product, a more robust parser generator like ANTLR or PEG.js would be better.
export const parse = (rawText: string): ParsedER => {
  const lines = rawText.split('\n').map(line => line.trim());
  const result: ParsedER = {
    entities: {},
    relationships: [],
  };

  let currentEntity: Entity | null = null;
  let inEntityBlock = false;

  for (const line of lines) {
    if (!line || line.startsWith('//')) {
      continue;
    }

    if (line.startsWith('title')) {
      result.title = line.substring('title'.length).trim();
      continue;
    }

    if (line.startsWith('notation')) {
      const notation = line.substring('notation'.length).trim();
      if (notation === 'chen' || notation === 'crows-foot') {
        result.notation = notation;
      }
      continue;
    }

    // Regex to match entity definitions like: user [icon: user] {
    const entityMatch = line.match(/^(\w+)\s*(?:\[(.*)\])?\s*\{/);
    if (entityMatch) {
      const entityName = entityMatch[1];
      const metadata = entityMatch[2]; // e.g., icon: user, color: blue

      currentEntity = {
        name: entityName,
        attributes: {},
      };

      if (metadata) {
        metadata.split(',').forEach(meta => {
          const [key, value] = meta.split(':').map(s => s.trim());
          if (key === 'icon') currentEntity.icon = value;
          if (key === 'color') currentEntity.color = value;
        });
      }

      result.entities[entityName] = currentEntity;
      inEntityBlock = true;
      continue;
    }

    if (line.includes('}')) {
      inEntityBlock = false;
      currentEntity = null;
      continue;
    }

    // Parse attributes inside an entity block
    if (inEntityBlock && currentEntity) {
      const parts = line.split(/\s+/).filter(Boolean);
      if (parts.length > 0) {
        const attributeName = parts[0];
        currentEntity.attributes[attributeName] = {
          name: attributeName,
          type: parts[1] || 'string',
          isPk: parts.includes('pk'),
          isFk: parts.includes('fk'),
          isUnique: parts.includes('unique'),
          isIndex: parts.includes('index'),
        };
      }
    }

    // Parse relationships (e.g., user.id - profile.user_id)
    const relationshipMatch = line.match(/(\w+)\.(\w+)\s*([-><]+)\s*(\w+)\.(\w+)/);
    if (relationshipMatch) {
      const [, fromEntity, fromAttribute, type, toEntity, toAttribute] = relationshipMatch;

      let relType: Relationship['type'] = 'one-to-one';
      if (type === '-') relType = 'one-to-one';
      if (type === '>') relType = 'one-to-many';
      if (type === '<') relType = 'many-to-one';
      if (type === '<>') relType = 'many-to-many';

      result.relationships.push({
        fromEntity,
        fromAttribute,
        toEntity,
        toAttribute,
        type: relType,
      });
    }
  }

  return result;
};
