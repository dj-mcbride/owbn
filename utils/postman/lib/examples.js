/**
 * This module defines a custom jsDoc tag.
 * It allows you to document methodRoles parameters.
 * @module lib/examples
 */

exports.name = 'examples';

exports.options = {
  mustHaveValue: true,
  onTagged(doclet, tag) {
    if (doclet.examples === undefined) doclet.examples = [];
    doclet.examples.push(JSON.parse(tag.value));
  },
};
