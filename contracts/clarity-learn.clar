(define-data-var clicks uint 0)

(define-public (record-cick)
    (begin
        (var-set clicks (+ (var-get click) u1))
        (ok (var-get clicks))
    )
)

(define-read-only (get-clicks)
    (ok (var-get clicks))
)