package client

type Client interface {
	AddEdit(diff string) (string, error)
	GetEdit(diff string) (string, error)

	Close() error
}
