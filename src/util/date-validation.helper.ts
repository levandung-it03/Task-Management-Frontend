export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface DateValidationResult {
  isValid: boolean;
  errors: string[];
}

export class DateValidationHelper {
  /**
   * Validate project form data (name, description, dates)
   * @param name - Tên project (bắt buộc)
   * @param description - Mô tả project (có thể null)
   * @param startDate - Ngày bắt đầu (bắt buộc)
   * @param endDate - Ngày kết thúc (có thể null)
   * @param dueDate - Hạn chót (bắt buộc)
   * @returns ValidationResult
   */
  static validateProjectForm(
    name: string,
    description: string | null | undefined,
    startDate: string,
    endDate: string | null | undefined,
    dueDate: string
  ): ValidationResult {
    const errors: string[] = [];

    // 1. Validate name - Bắt buộc
    if (!name || name.trim() === '') {
      errors.push('Tên project không được để trống');
    }

    // 2. Validate start_date - Bắt buộc
    if (!startDate || startDate.trim() === '') {
      errors.push('Ngày bắt đầu không được để trống');
    }

    // 3. Validate dueDate - Bắt buộc
    if (!dueDate || dueDate.trim() === '') {
      errors.push('Hạn chót không được để trống');
    }

    // 4. Validate dueDate > start_date
    if (startDate && dueDate) {
      const start = new Date(startDate);
      const due = new Date(dueDate);
      
      if (due <= start) {
        errors.push('Hạn chót phải lớn hơn ngày bắt đầu');
      }
    }

    // 5. Validate end_date >= start_date (nếu có end_date)
    if (endDate && endDate.trim() !== '' && startDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        errors.push('Ngày kết thúc phải bằng hoặc sau ngày bắt đầu');
      }
    }

    // 6. Validate end_date <= dueDate (nếu có end_date và dueDate)
    if (endDate && endDate.trim() !== '' && dueDate) {
      const end = new Date(endDate);
      const due = new Date(dueDate);
      
      if (end > due) {
        errors.push('Ngày kết thúc không được vượt quá hạn chót');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate phase form data (name, description, dates)
   * @param name - Tên phase (bắt buộc)
   * @param description - Mô tả phase (có thể null)
   * @param startDate - Ngày bắt đầu (bắt buộc)
   * @param endDate - Ngày kết thúc (có thể null)
   * @param dueDate - Hạn chót (bắt buộc)
   * @returns ValidationResult
   */
  static validatePhaseForm(
    name: string,
    description: string | null | undefined,
    startDate: string,
    endDate: string | null | undefined,
    dueDate: string
  ): ValidationResult {
    const errors: string[] = [];

    // 1. Validate name - Bắt buộc
    if (!name || name.trim() === '') {
      errors.push('Tên phase không được để trống');
    }

    // 2. Validate start_date - Bắt buộc
    if (!startDate || startDate.trim() === '') {
      errors.push('Ngày bắt đầu không được để trống');
    }

    // 3. Validate dueDate - Bắt buộc
    if (!dueDate || dueDate.trim() === '') {
      errors.push('Hạn chót không được để trống');
    }

    // 4. Validate dueDate > start_date
    if (startDate && dueDate) {
      const start = new Date(startDate);
      const due = new Date(dueDate);
      
      if (due <= start) {
        errors.push('Hạn chót phải lớn hơn ngày bắt đầu');
      }
    }

    // 5. Validate end_date >= start_date (nếu có end_date)
    if (endDate && endDate.trim() !== '' && startDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        errors.push('Ngày kết thúc phải bằng hoặc sau ngày bắt đầu');
      }
    }

    // 6. Validate end_date <= dueDate (nếu có end_date và dueDate)
    if (endDate && endDate.trim() !== '' && dueDate) {
      const end = new Date(endDate);
      const due = new Date(dueDate);
      
      if (end > due) {
        errors.push('Ngày kết thúc không được vượt quá hạn chót');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate collection form data (name, description, dates)
   * @param name - Tên collection (bắt buộc)
   * @param description - Mô tả collection (có thể null)
   * @param startDate - Ngày bắt đầu (bắt buộc)
   * @param dueDate - Hạn chót (bắt buộc)
   * @returns ValidationResult
   */
  static validateCollectionForm(
    name: string,
    description: string | null | undefined,
    startDate: string,
    dueDate: string
  ): ValidationResult {
    const errors: string[] = [];

    // 1. Validate name - Bắt buộc
    if (!name || name.trim() === '') {
      errors.push('Tên collection không được để trống');
    }

    // 2. Validate start_date - Bắt buộc
    if (!startDate || startDate.trim() === '') {
      errors.push('Ngày bắt đầu không được để trống');
    }

    // 3. Validate dueDate - Bắt buộc
    if (!dueDate || dueDate.trim() === '') {
      errors.push('Hạn chót không được để trống');
    }

    // 4. Validate dueDate > start_date
    if (startDate && dueDate) {
      const start = new Date(startDate);
      const due = new Date(dueDate);
      
      if (due <= start) {
        errors.push('Hạn chót phải lớn hơn ngày bắt đầu');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate date constraints for project creation/update
   * @param startDate - Ngày bắt đầu (bắt buộc)
   * @param endDate - Ngày kết thúc (có thể null)
   * @param dueDate - Hạn chót (bắt buộc)
   * @returns DateValidationResult
   */
  static validateProjectDates(
    startDate: string,
    endDate: string | null | undefined,
    dueDate: string
  ): DateValidationResult {
    const errors: string[] = [];

    // 1. Validate start_date - Không được để trống
    if (!startDate || startDate.trim() === '') {
      errors.push('Ngày bắt đầu không được để trống');
    }

    // 2. Validate dueDate - Bắt buộc phải có giá trị
    if (!dueDate || dueDate.trim() === '') {
      errors.push('Hạn chót không được để trống');
    }

    // 3. Validate dueDate > start_date
    if (startDate && dueDate) {
      const start = new Date(startDate);
      const due = new Date(dueDate);
      
      if (due <= start) {
        errors.push('Hạn chót phải lớn hơn ngày bắt đầu');
      }
    }

    // 4. Validate end_date >= start_date (nếu có end_date)
    if (endDate && endDate.trim() !== '' && startDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        errors.push('Ngày kết thúc phải bằng hoặc sau ngày bắt đầu');
      }
    }

    // 5. Validate end_date <= dueDate (nếu có end_date và dueDate)
    if (endDate && endDate.trim() !== '' && dueDate) {
      const end = new Date(endDate);
      const due = new Date(dueDate);
      
      if (end > due) {
        errors.push('Ngày kết thúc không được vượt quá hạn chót');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate date constraints for phase creation/update
   * @param startDate - Ngày bắt đầu (bắt buộc)
   * @param endDate - Ngày kết thúc (có thể null)
   * @param dueDate - Hạn chót (bắt buộc)
   * @returns DateValidationResult
   */
  static validatePhaseDates(
    startDate: string,
    endDate: string | null | undefined,
    dueDate: string
  ): DateValidationResult {
    const errors: string[] = [];

    // 1. Validate start_date - Không được để trống
    if (!startDate || startDate.trim() === '') {
      errors.push('Ngày bắt đầu không được để trống');
    }

    // 2. Validate dueDate - Bắt buộc phải có giá trị
    if (!dueDate || dueDate.trim() === '') {
      errors.push('Hạn chót không được để trống');
    }

    // 3. Validate dueDate > start_date
    if (startDate && dueDate) {
      const start = new Date(startDate);
      const due = new Date(dueDate);
      
      if (due <= start) {
        errors.push('Hạn chót phải lớn hơn ngày bắt đầu');
      }
    }

    // 4. Validate end_date >= start_date (nếu có end_date)
    if (endDate && endDate.trim() !== '' && startDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        errors.push('Ngày kết thúc phải bằng hoặc sau ngày bắt đầu');
      }
    }

    // 5. Validate end_date <= dueDate (nếu có end_date và dueDate)
    if (endDate && endDate.trim() !== '' && dueDate) {
      const end = new Date(endDate);
      const due = new Date(dueDate);
      
      if (end > due) {
        errors.push('Ngày kết thúc không được vượt quá hạn chót');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format date for display
   */
  static formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  }

  /**
   * Get minimum date for end_date input (must be >= start_date)
   */
  static getMinEndDate(startDate: string): string {
    if (!startDate) return '';
    return startDate;
  }

  /**
   * Get minimum date for dueDate input (must be > start_date)
   */
  static getMinDueDate(startDate: string): string {
    if (!startDate) return '';
    const start = new Date(startDate);
    start.setDate(start.getDate() + 1);
    return start.toISOString().split('T')[0];
  }

  /**
   * Get maximum date for end_date input (must be <= dueDate)
   */
  static getMaxEndDate(dueDate: string): string {
    if (!dueDate) return '';
    return dueDate;
  }
} 