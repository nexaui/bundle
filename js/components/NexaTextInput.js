class NexaTextInput {
    /**
     * Transform TextInput element into desired HTML format
     * @param {HTMLElement} element - The TextInput element to transform
     * @returns {HTMLElement} - The transformed element
     */
    static transform(element) {
        // Get all attributes from the element
        const attrs = this.getAttributes(element);
        
        // Prepare default values
        const {
            label = '',
            type = 'text',
            placeholder = label,
            value = '',
            id = this.generateId(label),
            className = '',
            col = '',
            size = '', // sm, lg, or empty for normal
            state = '', // valid, invalid, or empty for normal
            readonly = element.hasAttribute('readonly'),
            iconLeft = '',
            iconRight = '',
            iconClass = '',
            prefix = '',
            suffix = '',
            prefixIcon = '',
            suffixIcon = '',
            stack = element.hasAttribute('stack'),
            floating = element.hasAttribute('floating')
        } = attrs;

        // Create container element
        const container = document.createElement('div');
        
        // Prepare input attributes
        const baseClass = size ? `form-nexa-control-${size}` : 'form-nexa-control';
        let inputClass = `${baseClass}${className ? ' ' + className : ''}`;
        
        // Add state classes
        if (state === 'valid') inputClass += ' is-valid';
        if (state === 'invalid') inputClass += ' is-invalid';

        // Create input element
        const input = document.createElement('input');
        input.type = type;
        input.className = inputClass;
        input.id = id;
        input.autocomplete = id;
        input.placeholder = floating ? ' ' : placeholder;
        if (value) input.value = value;
        if (readonly) input.readOnly = true;

        // Handle floating label
        if (floating) {
            container.className = 'form-nexa-floating';
            
            if (iconLeft || iconRight) {
                const iconContainer = document.createElement('div');
                iconContainer.className = 'form-nexa-icon';
                
                if (iconLeft) {
                    const leftIcon = document.createElement('i');
                    leftIcon.className = `${iconClass} ${iconLeft}`;
                    iconContainer.appendChild(leftIcon);
                }
                
                iconContainer.appendChild(input);
                
                if (iconRight) {
                    const rightIcon = document.createElement('i');
                    rightIcon.className = `${iconClass} ${iconRight}`;
                    if (attrs.iconAction) {
                        rightIcon.dataset.action = attrs.iconAction;
                    }
                    iconContainer.appendChild(rightIcon);
                }
                
                if (label) {
                    const labelElement = document.createElement('label');
                    labelElement.htmlFor = id;
                    labelElement.textContent = label;
                    iconContainer.appendChild(labelElement);
                }
                
                container.appendChild(iconContainer);
            } else {
                container.appendChild(input);
                if (label) {
                    const labelElement = document.createElement('label');
                    labelElement.htmlFor = id;
                    labelElement.textContent = label;
                    container.appendChild(labelElement);
                }
            }
        } else {
            // Non-floating label
            container.className = `form-nexa ${col}`;
            
            if (label) {
                const labelElement = document.createElement('label');
                labelElement.htmlFor = id;
                labelElement.textContent = label;
                container.appendChild(labelElement);
            }

            if (prefix || suffix || prefixIcon || suffixIcon) {
                const groupContainer = document.createElement('div');
                let groupClass = 'form-nexa-input-group';
                if (stack) groupClass += ' form-nexa-input-group-stack';
                if (prefixIcon || suffixIcon) groupClass += ' form-nexa-input-group-icon';
                groupContainer.className = groupClass;

                // Add prefix
                if (prefix || prefixIcon) {
                    const prefixSpan = document.createElement('span');
                    prefixSpan.className = 'form-nexa-input-group-text';
                    if (prefixIcon) {
                        const icon = document.createElement('i');
                        icon.className = prefixIcon;
                        prefixSpan.appendChild(icon);
                    }
                    if (prefix) {
                        prefixSpan.appendChild(document.createTextNode(prefix));
                    }
                    groupContainer.appendChild(prefixSpan);
                }

                groupContainer.appendChild(input);

                // Add suffix
                if (suffix || suffixIcon) {
                    const suffixSpan = document.createElement('span');
                    suffixSpan.className = 'form-nexa-input-group-text';
                    if (suffixIcon) {
                        const icon = document.createElement('i');
                        icon.className = suffixIcon;
                        suffixSpan.appendChild(icon);
                    }
                    if (suffix) {
                        suffixSpan.appendChild(document.createTextNode(suffix));
                    }
                    groupContainer.appendChild(suffixSpan);
                }

                container.appendChild(groupContainer);
            } else if (iconLeft || iconRight) {
                const iconContainer = document.createElement('div');
                iconContainer.className = 'form-nexa-icon';

                if (iconLeft) {
                    const leftIcon = document.createElement('i');
                    leftIcon.className = `${iconClass} ${iconLeft}`;
                    iconContainer.appendChild(leftIcon);
                }

                iconContainer.appendChild(input);

                if (iconRight) {
                    const rightIcon = document.createElement('i');
                    rightIcon.className = `${iconClass} ${iconRight}`;
                    if (attrs.iconAction) {
                        rightIcon.id = 'iconLeft';
                        rightIcon.dataset.action = attrs.iconAction;
                    }
                    iconContainer.appendChild(rightIcon);
                }

                container.appendChild(iconContainer);
            } else {
                container.appendChild(input);
            }
        }

        return container;
    }

    /**
     * Get all attributes from an element
     * @param {HTMLElement} element - The element to get attributes from
     * @returns {Object} - Object containing all attributes
     */
    static getAttributes(element) {
        const attrs = {};
        for (const attr of element.attributes) {
            let value = attr.value;
            // Handle JSON values
            if (value.startsWith('{') && value.endsWith('}')) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    // Keep original value if parsing fails
                }
            }
            attrs[attr.name] = value;
        }
        return attrs;
    }

    /**
     * Generate ID from label or random string
     * @param {string} label - The label to generate ID from
     * @returns {string} - Generated ID
     */
    static generateId(label) {
        if (label) {
            return 'input_' + label.toLowerCase().replace(/[^a-z0-9]/g, '_');
        }
        return 'input_' + Math.random().toString(36).substr(2, 8);
    }

    /**
     * Initialize all TextInput elements in the document
     */
    static init() {
        document.querySelectorAll('TextInput').forEach(element => {
            const transformed = this.transform(element);
            element.parentNode.replaceChild(transformed, element);
        });
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    NexaTextInput.init();
});

// Export for module usage
export default NexaTextInput; 