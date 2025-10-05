;; ClarityLearn Dictionary Contract
;; A simple key-value store for learning Clarity basics

;; Track total number of unique terms stored
(define-data-var total-terms uint u0)

;; Define the dictionary map
(define-map clarity-dictionary
  { key: (string-ascii 32) }
  { value: (string-ascii 128) }
)

;; Public function to store a term
(define-public (store-term (key (string-ascii 32)) (value (string-ascii 128)))
  (let ((term-exists (is-some (map-get? clarity-dictionary { key: key }))))
    ;; Only increment counter if this is a new term
    (if (not term-exists)
      (var-set total-terms (+ (var-get total-terms) u1))
      true
    )
    (ok (map-set clarity-dictionary { key: key } { value: value }))
  )
)

;; Read-only function to get a term
(define-read-only (get-term (key (string-ascii 32)))
  (map-get? clarity-dictionary { key: key })
)

;; Read-only function to get total unique terms count
(define-read-only (get-total-terms)
  (ok (var-get total-terms))
)