import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent
} from '@mui/material'
import * as React from 'react'

type CommonSelectProps = {
  placeholder?: string
  options: {
    label: string
    value: string | number
    disabled?: boolean
    hidden?: boolean
  }[]
  value: number | string
  label?: string
  onChange: (e: SelectChangeEvent<number | string>) => void
  className?: string
  error?: boolean
  helperText?: string
  size?: 'small' | 'medium'
  fullWidth?: boolean
}

const CommonSelect: React.FC<CommonSelectProps> = ({
  placeholder,
  value,
  label,
  onChange,
  options,
  error,
  helperText,
  size = 'small',
  className,
  fullWidth,
  ...res
}) => {
  return (
    <>
      <FormControl className={'min-w-40'} size={size} error={error} fullWidth={fullWidth}>
        {label && <InputLabel>{label}</InputLabel>}
        <Select
          sx={{
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#F6C343' // 选中时边框颜色
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#F6C343' // hover 时边框颜色
            }
          }}
          className={className}
          {...res}
          displayEmpty
          autoWidth
          value={value}
          label={label}
          onChange={onChange}
          renderValue={selected => {
            if (selected === '' || selected === null || selected === undefined) {
              return <em className={'font-thin'}>{placeholder}</em>
            }
            const option = options.find(option => option.value === selected)
            return option ? option.label : ''
          }}
        >
          {placeholder && (
            <MenuItem value={''}>
              <em className={'font-thin'}>{placeholder}</em>
            </MenuItem>
          )}
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </>
  )
}

export default CommonSelect
