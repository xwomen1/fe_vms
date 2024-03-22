import React from 'react';
import { Grid, FormControl, Autocomplete, TextField } from '@mui/material';
import { Icon } from '@iconify/react';
import axios from 'axios';
import GroupTreeView from './GroupTreeView';
import CustomTextField from 'src/@core/components/mui/text-field';

const CustomAutocomplete = ({
  groupOptions,
  defaultGroup,
  handleGroupChange,
  valueGroup,
  handleFilterGroup,
}) => {
  return (
    <FormControl fullWidth>
      <Autocomplete
        options={groupOptions}
        getOptionLabel={(option) => option.groupName}
        value={defaultGroup}
        onChange={(event, newValue) => handleGroupChange(event, newValue)}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            label="Đơn vị"
          />
        )}
        renderOption={(props, option, { selected }) => (
          <div {...props}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {option.children && option.children.length > 0 && (
                <GroupTreeView
                  groups={option.children.map((child) => child.children)}
                  handleGroupChange={handleGroupChange}
                  valueGroup={valueGroup}
                  handleFilterGroup={handleFilterGroup}
                />
              )}
              {option.children && option.children.length > 0
                ? option.children.map((child) => child.groupName).join(', ')
                : option.groupName}
            </div>
          </div>
        )}
      />
    </FormControl>
  );
};

export default CustomAutocomplete;