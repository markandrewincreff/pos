package com.increff.pos.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.PositiveOrZero;

@Getter
@Setter
public class ProductUpsertForm {
    @NonNull
    String barcode;

    @NotBlank(message = "brand name cannot be null")
    String brandName;

    @NotBlank(message = "category cannot be null")
    String category;

    @NotBlank(message = "product name cannot be null")
    String productName;

    @PositiveOrZero(message = "quantity must be a non negative integer")
    Double mrp;

}
