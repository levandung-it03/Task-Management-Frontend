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
   * @param deadline - Hạn chót (bắt buộc)
   * @returns ValidationResult
   */
  static validateProjectForm(
    name: string,
    description: string | null | undefined,
    startDate: string,
    endDate: string | null | undefined,
    deadline: string
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

    // 3. Validate deadline - Bắt buộc
    if (!deadline || deadline.trim() === '') {
      errors.push('Hạn chót không được để trống');
    }

    // 4. Validate deadline > start_date
    if (startDate && deadline) {
      const start = new Date(startDate);
      const due = new Date(deadline);
      
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

    // 6. Validate end_date <= deadline (nếu có end_date và deadline)
    if (endDate && endDate.trim() !== '' && deadline) {
      const end = new Date(endDate);
      const due = new Date(deadline);
      
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
   * @param deadline - Hạn chót (bắt buộc)
   * @returns ValidationResult
   */
  static validatePhaseForm(
    name: string,
    description: string | null | undefined,
    startDate: string,
    endDate: string | null | undefined,
    deadline: string
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

    // 3. Validate deadline - Bắt buộc
    if (!deadline || deadline.trim() === '') {
      errors.push('Hạn chót không được để trống');
    }

    // 4. Validate deadline > start_date
    if (startDate && deadline) {
      const start = new Date(startDate);
      const due = new Date(deadline);
      
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

    // 6. Validate end_date <= deadline (nếu có end_date và deadline)
    if (endDate && endDate.trim() !== '' && deadline) {
      const end = new Date(endDate);
      const due = new Date(deadline);
      
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
   * @param endDate - Ngày kết thúc (có thể null)
   * @param deadline - Hạn chót (bắt buộc)
   * @returns ValidationResult
   */
  static validateCollectionForm(
    name: string,
    description: string | null | undefined,
    startDate: string,
    endDate: string | null | undefined,
    deadline: string
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

    // 3. Validate deadline - Bắt buộc
    if (!deadline || deadline.trim() === '') {
      errors.push('Hạn chót không được để trống');
    }

    // 4. Validate deadline > start_date
    if (startDate && deadline) {
      const start = new Date(startDate);
      const due = new Date(deadline);
      
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

    // 6. Validate end_date <= deadline (nếu có end_date và deadline)
    if (endDate && endDate.trim() !== '' && deadline) {
      const end = new Date(endDate);
      const due = new Date(deadline);
      
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
   * Validate date constraints for project creation/update
   * @param startDate - Ngày bắt đầu (bắt buộc)
   * @param endDate - Ngày kết thúc (có thể null)
   * @param deadline - Hạn chót (bắt buộc)
   * @returns DateValidationResult
   */
  static validateProjectDates(
    startDate: string,
    endDate: string | null | undefined,
    deadline: string
  ): DateValidationResult {
    const errors: string[] = [];

    // 1. Validate start_date - Không được để trống
    if (!startDate || startDate.trim() === '') {
      errors.push('Ngày bắt đầu không được để trống');
    }

    // 2. Validate deadline - Bắt buộc phải có giá trị
    if (!deadline || deadline.trim() === '') {
      errors.push('Hạn chót không được để trống');
    }

    // 3. Validate deadline > start_date
    if (startDate && deadline) {
      const start = new Date(startDate);
      const due = new Date(deadline);
      
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

    // 5. Validate end_date <= deadline (nếu có end_date và deadline)
    if (endDate && endDate.trim() !== '' && deadline) {
      const end = new Date(endDate);
      const due = new Date(deadline);
      
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
   * @param deadline - Hạn chót (bắt buộc)
   * @returns DateValidationResult
   */
  static validatePhaseDates(
    startDate: string,
    endDate: string | null | undefined,
    deadline: string
  ): DateValidationResult {
    const errors: string[] = [];

    // 1. Validate start_date - Không được để trống
    if (!startDate || startDate.trim() === '') {
      errors.push('Ngày bắt đầu không được để trống');
    }

    // 2. Validate deadline - Bắt buộc phải có giá trị
    if (!deadline || deadline.trim() === '') {
      errors.push('Hạn chót không được để trống');
    }

    // 3. Validate deadline > start_date
    if (startDate && deadline) {
      const start = new Date(startDate);
      const due = new Date(deadline);
      
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

    // 5. Validate end_date <= deadline (nếu có end_date và deadline)
    if (endDate && endDate.trim() !== '' && deadline) {
      const end = new Date(endDate);
      const due = new Date(deadline);
      
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
   * Get minimum date for deadline input (must be > start_date)
   */
  static getMinDeadline(startDate: string): string {
    if (!startDate) return '';
    const start = new Date(startDate);
    start.setDate(start.getDate() + 1);
    return start.toISOString().split('T')[0];
  }

  /**
   * Get maximum date for end_date input (must be <= deadline)
   */
  static getMaxEndDate(deadline: string): string {
    if (!deadline) return '';
    return deadline;
  }
} 