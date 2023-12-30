package com.example.playground.edit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberEditResponseDTO {

    int status; // HTTP 상태 코드 중 200
}
