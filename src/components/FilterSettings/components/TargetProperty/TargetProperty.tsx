import React, { FC } from 'react';

type Props = {
  /** Current target property*/
  targetProperty: string | null;
  /** Event stream schema */
  schema: Record<string, string>;
  /** Target property change event handler */
  onChange: (targetProperty: string) => void;
};

const TargetProperty: FC<Props> = ({ targetProperty, schema, onChange }) => (
  <select
    value={targetProperty ? targetProperty : ''}
    onChange={(e) => onChange(e.target.value)}
  >
    {Object.keys(schema).map((propertyName) => (
      <option key={propertyName} value={propertyName}>
        {propertyName}
      </option>
    ))}
  </select>
);
export default TargetProperty;
