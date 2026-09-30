import React from 'react';
import {
  DecoratorNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  DOMExportOutput,
  DOMConversionMap,
  $applyNodeReplacement,
} from 'lexical';
import { ImageComponent } from '../components/image.component';

export interface ImagePayload {
  altText: string;
  caption?: string;
  height?: number | 'inherit';
  key?: NodeKey;
  maxWidth?: number;
  src: string;
  width?: number | string;
  alignment?: 'left' | 'center' | 'right' | 'full';
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    caption?: string;
    height?: number | 'inherit';
    maxWidth?: number;
    src: string;
    width?: number | string;
    alignment?: 'left' | 'center' | 'right' | 'full';
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __altText: string;
  __caption?: string;
  __width: number | string;
  __alignment: 'left' | 'center' | 'right' | 'full';

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__caption,
      node.__width,
      node.__alignment,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, caption, src, width, alignment } = serializedNode;
    return $createImageNode({
      altText,
      caption,
      src,
      width,
      alignment,
    });
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('figure');
    element.style.textAlign =
      this.__alignment === 'left' ? 'left' : this.__alignment === 'right' ? 'right' : 'center';
    element.style.margin = '1.5rem 0';

    const img = document.createElement('img');
    img.setAttribute('src', this.__src);
    img.setAttribute('alt', this.__altText || '');
    img.style.maxWidth = '100%';
    img.style.width = typeof this.__width === 'number' ? `${this.__width}px` : this.__width || '75%';
    img.style.borderRadius = '0.75rem';
    img.style.display = 'inline-block';
    element.appendChild(img);

    if (this.__caption) {
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = this.__caption;
      figcaption.style.fontSize = '0.75rem';
      figcaption.style.color = '#64748b';
      figcaption.style.marginTop = '0.5rem';
      figcaption.style.fontStyle = 'italic';
      element.appendChild(figcaption);
    }

    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: (domNode: HTMLElement) => {
          if (domNode instanceof HTMLImageElement) {
            const { src, alt } = domNode;
            const node = $createImageNode({ src, altText: alt });
            return { node };
          }
          return null;
        },
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    caption?: string,
    width: number | string = '75%',
    alignment: 'left' | 'center' | 'right' | 'full' = 'center',
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__caption = caption;
    this.__width = width;
    this.__alignment = alignment;
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      caption: this.__caption,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width,
      alignment: this.__alignment,
    };
  }

  updateData(data: { width?: number | string; alignment?: 'left' | 'center' | 'right' | 'full'; caption?: string }) {
    const writable = this.getWritable();
    if (data.width !== undefined) writable.__width = data.width;
    if (data.alignment !== undefined) writable.__alignment = data.alignment;
    if (data.caption !== undefined) writable.__caption = data.caption;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    span.className = 'lexical-image-wrapper block';
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactElement {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        caption={this.__caption}
        width={this.__width}
        alignment={this.__alignment}
        nodeKey={this.getKey()}
      />
    );
  }
}

export function $createImageNode({
  altText,
  caption,
  src,
  width = '75%',
  alignment = 'center',
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, altText, caption, width, alignment, key));
}

export function $isImageNode(node: unknown): node is ImageNode {
  return node instanceof ImageNode;
}
